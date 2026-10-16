using Moq;
using NUnit.Framework;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Services;
using WoofWay.Domain.Entities;

namespace WoofWay.UnitTests.Features.Admin;

[TestFixture]
public class AdminServiceTests
{
    private Mock<IRepository<User>> _userRepoMock;
    private Mock<IRepository<Shelter>> _shelterRepoMock;
    private Mock<IRepository<SittingOffer>> _offerRepoMock;

    private AdminService _adminService;

    [SetUp]
    public void Setup()
    {
        _userRepoMock = new Mock<IRepository<User>>();
        _shelterRepoMock = new Mock<IRepository<Shelter>>();
        _offerRepoMock = new Mock<IRepository<SittingOffer>>();

        _adminService = new AdminService(
            _userRepoMock.Object,
            _shelterRepoMock.Object,
            _offerRepoMock.Object);
    }

    [Test]
    public async Task GetPendingSheltersAsync_ShouldReturnOnlyUnverifiedShelters()
    {
        // Arrange
        var shelters = new List<Shelter>
        {
            new() { Id = "1", UserId = "u1", ShelterName = "Shelter A", IsVerified = false },
            new() { Id = "2", UserId = "u2", ShelterName = "Shelter B", IsVerified = true },
            new() { Id = "3", UserId = "u3", ShelterName = "Shelter C", IsVerified = false }
        };

        _shelterRepoMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(shelters);

        _userRepoMock
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new User { Email = "test@test.com" });

        // Act
        var result = await _adminService.GetPendingSheltersAsync();

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(result.Data.Count(), Is.EqualTo(2));
    }

    [Test]
    public async Task ApproveShelterAsync_ShouldFail_WhenShelterDoesNotExist()
    {
        // Arrange
        _shelterRepoMock
            .Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((Shelter?)null);

        // Act
        var result = await _adminService.ApproveShelterAsync("1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Azil nije pronađen."));
    }

    [Test]
    public async Task ApproveShelterAsync_ShouldVerifyShelter_WhenShelterExists()
    {
        // Arrange
        var shelter = new Shelter
        {
            Id = "1",
            IsVerified = false
        };

        _shelterRepoMock
            .Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(shelter);

        // Act
        var result = await _adminService.ApproveShelterAsync("1");

        // Assert
        Assert.That(result.Success, Is.True);
        Assert.That(shelter.IsVerified, Is.True);

        _shelterRepoMock.Verify(
            r => r.UpdateAsync("1", It.IsAny<Shelter>()),
            Times.Once);
    }

    [Test]
    public async Task DeleteUserAsync_ShouldFail_WhenUserDoesNotExist()
    {
        // Arrange
        _userRepoMock
            .Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _adminService.DeleteUserAsync("1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Korisnik nije pronađen."));
    }

    [Test]
    public async Task DeleteUserAsync_ShouldDeleteUser_WhenUserExists()
    {
        // Arrange
        var user = new User { Id = "1" };

        _userRepoMock
            .Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(user);

        // Act
        var result = await _adminService.DeleteUserAsync("1");

        // Assert
        Assert.That(result.Success, Is.True);

        _userRepoMock.Verify(
            r => r.DeleteAsync("1"),
            Times.Once);
    }

    [Test]
    public async Task DeleteOfferAsync_ShouldFail_WhenOfferDoesNotExist()
    {
        // Arrange
        _offerRepoMock
            .Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((SittingOffer?)null);

        // Act
        var result = await _adminService.DeleteOfferAsync("1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Ponuda nije pronađena."));
    }

    [Test]
    public async Task DeleteOfferAsync_ShouldDeleteOffer_WhenOfferExists()
    {
        // Arrange
        var offer = new SittingOffer { Id = "1" };

        _offerRepoMock
            .Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(offer);

        // Act
        var result = await _adminService.DeleteOfferAsync("1");

        // Assert
        Assert.That(result.Success, Is.True);

        _offerRepoMock.Verify(
            r => r.DeleteAsync("1"),
            Times.Once);
    }
}