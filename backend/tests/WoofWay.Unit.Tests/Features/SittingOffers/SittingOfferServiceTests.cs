using Moq;
using NUnit.Framework;
using WoofWay.Application.DTOs.SittingOffers;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.ValueObjects;

namespace WoofWay.UnitTests.Features.SittingOffers;

[TestFixture]
public class SittingOfferServiceTests
{
    private Mock<IRepository<SittingOffer>> _offerRepoMock;
    private Mock<IUserRepository> _userRepoMock;

    private SittingOfferService _service;

    [SetUp]
    public void Setup()
    {
        _offerRepoMock = new Mock<IRepository<SittingOffer>>();
        _userRepoMock = new Mock<IUserRepository>();

        _service = new SittingOfferService(
            _offerRepoMock.Object,
            _userRepoMock.Object
        );
    }

    [Test]
    public async Task GetAllActiveAsync_ShouldReturnOnlyActiveOffers()
    {
        var data = new List<SittingOffer>
        {
            new() { Id = "1", IsActive = true, SitterId = "u1" },
            new() { Id = "2", IsActive = false, SitterId = "u2" }
        };

        _offerRepoMock.Setup(r => r.GetQueryable())
            .Returns(data.AsQueryable());

        _userRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new User { Id = "u1", City = "Nis" });

        var result = await _service.GetAllActiveAsync(null);

        Assert.That(result.Data.Count(), Is.EqualTo(1));
    }

    [Test]
    public async Task GetAllActiveAsync_ShouldFilterByCity()
    {
        var data = new List<SittingOffer>
        {
            new() { Id = "1", IsActive = true, SitterId = "u1" }
        };

        _offerRepoMock.Setup(r => r.GetQueryable())
            .Returns(data.AsQueryable());

        _userRepoMock.Setup(r => r.GetByIdAsync("u1"))
            .ReturnsAsync(new User { Id = "u1", City = "Nis" });

        var result = await _service.GetAllActiveAsync("Belgrade");

        Assert.That(result.Data.Count(), Is.EqualTo(0));
    }

    [Test]
    public async Task GetByIdAsync_ShouldFail_WhenOfferNotFound()
    {
        _offerRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((SittingOffer?)null);

        var result = await _service.GetByIdAsync("1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task DeleteAsync_ShouldFail_WhenOfferNotFound()
    {
        _offerRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((SittingOffer?)null);

        var result = await _service.DeleteAsync("1", "u1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task GetMySittingOffersAsync_ShouldReturnOnlyUserOffers()
    {
        var data = new List<SittingOffer>
        {
            new() { Id = "1", SitterId = "u1", IsActive = true },
            new() { Id = "2", SitterId = "u2", IsActive = true }
        };

        _offerRepoMock.Setup(r => r.GetQueryable())
            .Returns(data.AsQueryable());

        _userRepoMock.Setup(r => r.GetByIdAsync("u1"))
            .ReturnsAsync(new User { Id = "u1", City = "Nis" });

        var result = await _service.GetMySittingOffersAsync("u1");

        Assert.That(result.Data.Count(), Is.EqualTo(1));
    }
}