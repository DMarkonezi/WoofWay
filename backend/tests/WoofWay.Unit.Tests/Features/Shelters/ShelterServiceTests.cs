using Moq;
using NUnit.Framework;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Services;
using WoofWay.Domain.Entities;

namespace WoofWay.UnitTests.Features.Shelters;

[TestFixture]
public class ShelterServiceTests
{
    private Mock<IRepository<Shelter>> _shelterRepoMock;
    private Mock<IRepository<Dog>> _dogRepoMock;
    private Mock<IRepository<AdoptionRequest>> _adoptionRepoMock;
    private Mock<ICurrentUserService> _currentUserMock;

    private ShelterService _service;

    [SetUp]
    public void Setup()
    {
        _shelterRepoMock = new Mock<IRepository<Shelter>>();
        _dogRepoMock = new Mock<IRepository<Dog>>();
        _adoptionRepoMock = new Mock<IRepository<AdoptionRequest>>();
        _currentUserMock = new Mock<ICurrentUserService>();

        _service = new ShelterService(
            _shelterRepoMock.Object,
            _dogRepoMock.Object,
            _currentUserMock.Object,
            _adoptionRepoMock.Object
        );
    }

    [Test]
    public async Task GetAllVerifiedAsync_ShouldReturnOnlyVerifiedShelters()
    {
        var data = new List<Shelter>
        {
            new() { Id = "1", IsVerified = true },
            new() { Id = "2", IsVerified = false }
        };

        _shelterRepoMock.Setup(r => r.GetQueryable())
            .Returns(data.AsQueryable());

        var result = await _service.GetAllVerifiedAsync();

        Assert.That(result.Data.Count(), Is.EqualTo(1));
    }

    [Test]
    public async Task GetByIdAsync_ShouldFail_WhenShelterNotFound()
    {
        _shelterRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((Shelter?)null);

        var result = await _service.GetByIdAsync("1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task GetByIdAsync_ShouldReturnDogs_ForShelter()
    {
        var shelter = new Shelter
        {
            Id = "1",
            UserId = "u1",
            ShelterName = "Test"
        };

        var dogs = new List<Dog>
        {
            new() { Id = "d1", CreatorId = "u1" },
            new() { Id = "d2", CreatorId = "u1" }
        };

        _shelterRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(shelter);

        _dogRepoMock.Setup(r => r.GetQueryable())
            .Returns(dogs.AsQueryable());

        _currentUserMock.Setup(c => c.UserId)
            .Returns("user1");

        _adoptionRepoMock.Setup(r => r.GetQueryable())
            .Returns(new List<AdoptionRequest>().AsQueryable());

        var result = await _service.GetByIdAsync("1");

        Assert.That(result.Success, Is.True);
        Assert.That(result.Data.Dogs.Count, Is.EqualTo(2));
    }

    [Test]
    public async Task GetByIdAsync_ShouldIncludeAdoptionRequestMapping()
    {
        var shelter = new Shelter
        {
            Id = "1",
            UserId = "u1",
            ShelterName = "Test"
        };

        var dog = new Dog
        {
            Id = "d1",
            CreatorId = "u1"
        };

        var request = new AdoptionRequest
        {
            Id = "r1",
            DogId = "d1",
            AdopterId = "user1"
        };

        _shelterRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(shelter);

        _dogRepoMock.Setup(r => r.GetQueryable())
            .Returns(new List<Dog> { dog }.AsQueryable());

        _currentUserMock.Setup(c => c.UserId)
            .Returns("user1");

        _adoptionRepoMock.Setup(r => r.GetQueryable())
            .Returns(new List<AdoptionRequest> { request }.AsQueryable());

        var result = await _service.GetByIdAsync("1");

        Assert.That(result.Success, Is.True);
        Assert.That(result.Data.Dogs.First().AdoptionRequestId, Is.EqualTo("r1"));
    }
}