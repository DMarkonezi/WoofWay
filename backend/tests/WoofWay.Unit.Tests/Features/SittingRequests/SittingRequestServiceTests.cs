using Moq;
using NUnit.Framework;
using WoofWay.Application.DTOs.SittingRequests;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;
using WoofWay.Application.Common.Interfaces;

namespace WoofWay.UnitTests.Features.SittingRequests;

[TestFixture]
public class SittingRequestServiceTests
{
    private Mock<IRepository<SittingRequest>> _requestRepoMock;
    private Mock<IRepository<SittingOffer>> _offerRepoMock;
    private Mock<IRepository<User>> _userRepoMock;
    private Mock<IRepository<Dog>> _dogRepoMock;
    private Mock<IEventDispatcher> _eventDispatcherMock;

    private SittingRequestService _service;

    [SetUp]
    public void Setup()
    {
        _requestRepoMock = new Mock<IRepository<SittingRequest>>();
        _offerRepoMock = new Mock<IRepository<SittingOffer>>();
        _userRepoMock = new Mock<IRepository<User>>();
        _dogRepoMock = new Mock<IRepository<Dog>>();
        _eventDispatcherMock = new Mock<IEventDispatcher>();

        _service = new SittingRequestService(
            _requestRepoMock.Object,
            _offerRepoMock.Object,
            _userRepoMock.Object,
            _dogRepoMock.Object,
            _eventDispatcherMock.Object
        );
    }

    [Test]
    public async Task CreateAsync_ShouldFail_WhenOfferDoesNotExist()
    {
        var request = new CreateSittingRequestRequest
        (
            "1",
            "dog1",
            DateTime.UtcNow.AddHours(2),
           DateTime.UtcNow.AddHours(3),
           ""
        );

        _offerRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((SittingOffer?)null);

        var result = await _service.CreateAsync(request, "owner1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task CreateAsync_ShouldFail_WhenTimeIsInvalid()
    {
        var request = new CreateSittingRequestRequest(
            "1",                                // SittingOfferId
            "dog1",                             // DogId
            DateTime.UtcNow.AddHours(-1),       // StartTime
            DateTime.UtcNow.AddHours(2),        // EndTime
            "Note"                              // Note
        );

        _offerRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(new SittingOffer { Id = "1", IsActive = true });

        var result = await _service.CreateAsync(request, "owner1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task CreateAsync_ShouldFail_WhenEndBeforeStart()
    {
        var start = DateTime.UtcNow.AddHours(3);

        var request = new CreateSittingRequestRequest(
            "1",             // SittingOfferId
            "dog1",          // DogId
            start,           // StartTime
            start.AddHours(-1), // EndTime (promenio sam u +2 da ti ne pukne biznis validacija)
            "Note"           // Note (ili stavi null/string.Empty ako je opciono, ali moraš proslediti jer konstruktor traži 5 parametara)
        );

        _offerRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(new SittingOffer { Id = "1", IsActive = true });

        var result = await _service.CreateAsync(request, "owner1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task UpdateStatusAsync_ShouldFail_WhenRequestNotFound()
    {
        _requestRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((SittingRequest?)null);

        var result = await _service.UpdateStatusAsync("1", "Approved", "sitter1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task CancelRequestAsync_ShouldFail_WhenNotOwner()
    {
        var request = new SittingRequest
        {
            Id = "1",
            OwnerId = "owner1"
        };

        _requestRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(request);

        var result = await _service.CancelRequestAsync("1", "otherUser");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task CancelRequestAsync_ShouldSucceed_WhenOwnerCancels()
    {
        var request = new SittingRequest
        {
            Id = "1",
            OwnerId = "owner1"
        };

        _requestRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(request);

        _requestRepoMock
            .Setup(r => r.UpdateAsync("1", It.IsAny<SittingRequest>()))
            .Returns(Task.CompletedTask);

        var result = await _service.CancelRequestAsync("1", "owner1");

        Assert.That(result.Success, Is.True);
    }
}