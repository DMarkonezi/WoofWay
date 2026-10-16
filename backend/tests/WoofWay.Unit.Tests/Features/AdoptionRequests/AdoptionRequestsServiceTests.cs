using Moq;
using NUnit.Framework;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Common.Interfaces;
using WoofWay.Application.Services;
using WoofWay.Application.DTOs.AdoptionRequests;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;
using WoofWay.Application.Events.Adoption;

namespace WoofWay.UnitTests.Features.AdoptionRequests;

[TestFixture]
public class AdoptionRequestServiceTests
{
    private Mock<IRepository<AdoptionRequest>> _requestRepoMock;
    private Mock<IRepository<Dog>> _dogRepoMock;
    private Mock<IRepository<User>> _userRepoMock;
    private Mock<IEventDispatcher> _eventDispatcherMock;

    private AdoptionRequestService _service;

    [SetUp]
    public void Setup()
    {
        _requestRepoMock = new Mock<IRepository<AdoptionRequest>>();
        _dogRepoMock = new Mock<IRepository<Dog>>();
        _userRepoMock = new Mock<IRepository<User>>();
        _eventDispatcherMock = new Mock<IEventDispatcher>();

        _service = new AdoptionRequestService(
            _requestRepoMock.Object,
            _dogRepoMock.Object,
            _userRepoMock.Object,
            _eventDispatcherMock.Object
        );
    }

    [Test]
    public async Task CreateAsync_ShouldFail_WhenDogDoesNotExist()
    {
        // Arrange
        _dogRepoMock.Setup(r => r.GetByIdAsync("dog1"))
            .ReturnsAsync((Dog?)null);

        var request = new CreateAdoptionRequestRequest("dog1", "note");

        // Act
        var result = await _service.CreateAsync(request, "user1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Pas ne postoji."));
    }

    [Test]
    public async Task CreateAsync_ShouldFail_WhenRequestAlreadyExists()
    {
        // Arrange
        _dogRepoMock.Setup(r => r.GetByIdAsync("dog1"))
            .ReturnsAsync(new Dog { Id = "dog1", CreatorId = "shelter1" });

        var existing = new AdoptionRequest
        {
            DogId = "dog1",
            AdopterId = "user1",
            Status = RequestStatus.Pending
        };

        _requestRepoMock.Setup(r => r.GetQueryable())
            .Returns(new List<AdoptionRequest> { existing }.AsQueryable());

        var request = new CreateAdoptionRequestRequest("dog1", "note");

        // Act
        var result = await _service.CreateAsync(request, "user1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Već ste poslali zahtev za ovog psa."));
    }

    [Test]
    public async Task CreateAsync_ShouldCreateRequest_WhenValid()
    {
        // Arrange
        _dogRepoMock.Setup(r => r.GetByIdAsync("dog1"))
            .ReturnsAsync(new Dog { Id = "dog1", CreatorId = "shelter1" });

        _requestRepoMock.Setup(r => r.GetQueryable())
            .Returns(new List<AdoptionRequest>().AsQueryable());

        _requestRepoMock.Setup(r => r.CreateAsync(It.IsAny<AdoptionRequest>()))
            .Returns(Task.CompletedTask);

        var request = new CreateAdoptionRequestRequest("dog1", "note");

        // Act
        var result = await _service.CreateAsync(request, "user1");

        // Assert
        Assert.That(result.Success, Is.True);

        _requestRepoMock.Verify(r => r.CreateAsync(It.IsAny<AdoptionRequest>()), Times.Once);
    }

    [Test]
    public async Task UpdateStatusAsync_ShouldFail_WhenRequestNotFound()
    {
        // Arrange
        _requestRepoMock.Setup(r => r.GetByIdAsync("req1"))
            .ReturnsAsync((AdoptionRequest?)null);

        // Act
        var result = await _service.UpdateStatusAsync("req1", "Approved", "shelter1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Zahtev nije pronađen."));
    }

    [Test]
    public async Task UpdateStatusAsync_ShouldFail_WhenShelterNotOwner()
    {
        // Arrange
        _requestRepoMock.Setup(r => r.GetByIdAsync("req1"))
            .ReturnsAsync(new AdoptionRequest
            {
                Id = "req1",
                ShelterId = "shelter2"
            });

        // Act
        var result = await _service.UpdateStatusAsync("req1", "Approved", "shelter1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Nemate dozvolu za upravljanje ovim azilom."));
    }

    [Test]
    public async Task UpdateStatusAsync_ShouldFail_WhenStatusInvalid()
    {
        // Arrange
        _requestRepoMock.Setup(r => r.GetByIdAsync("req1"))
            .ReturnsAsync(new AdoptionRequest
            {
                Id = "req1",
                ShelterId = "shelter1"
            });

        // Act
        var result = await _service.UpdateStatusAsync("req1", "INVALID_STATUS", "shelter1");

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Nevažeći status."));
    }

    [Test]
    public async Task UpdateStatusAsync_ShouldPublishEvent_WhenApproved()
    {
        // Arrange
        var requestEntity = new AdoptionRequest
        {
            Id = "req1",
            DogId = "dog1",
            AdopterId = "user1",
            ShelterId = "shelter1",
            Status = RequestStatus.Pending
        };

        _requestRepoMock.Setup(r => r.GetByIdAsync("req1"))
            .ReturnsAsync(requestEntity);

        _requestRepoMock.Setup(r => r.UpdateAsync("req1", It.IsAny<AdoptionRequest>()))
            .Returns(Task.CompletedTask);

        _dogRepoMock.Setup(r => r.GetByIdAsync("dog1"))
            .ReturnsAsync(new Dog { Name = "Buddy" });

        _userRepoMock.Setup(r => r.GetByIdAsync("user1"))
            .ReturnsAsync(new User { FirstName = "Marko" });

        _eventDispatcherMock.Setup(e =>
                e.PublishAsync(It.IsAny<AdoptionRequestApprovedEvent>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.UpdateStatusAsync("req1", "Approved", "shelter1");

        // Assert
        Assert.That(result.Success, Is.True);

        _eventDispatcherMock.Verify(
            e => e.PublishAsync(It.IsAny<AdoptionRequestApprovedEvent>()),
            Times.Once);
    }
}