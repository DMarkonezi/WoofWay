using Moq;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.UnitTests.Features.Chat;

[TestFixture]
public class ChatServiceTests
{
    private Mock<IChatRepository> _chatRepoMock;
    private Mock<IRepository<SittingRequest>> _sittingRepoMock;
    private Mock<IRepository<AdoptionRequest>> _adoptionRepoMock;
    private Mock<IRepository<SittingOffer>> _offerRepoMock;

    private ChatService _service;

    [SetUp]
    public void Setup()
    {
        _chatRepoMock = new Mock<IChatRepository>();
        _sittingRepoMock = new Mock<IRepository<SittingRequest>>();
        _adoptionRepoMock = new Mock<IRepository<AdoptionRequest>>();
        _offerRepoMock = new Mock<IRepository<SittingOffer>>();

        _service = new ChatService(
            _chatRepoMock.Object,
            _sittingRepoMock.Object,
            _adoptionRepoMock.Object,
            _offerRepoMock.Object
        );
    }

    [Test]
    public async Task GetMyRoomsAsync_ShouldReturnOnlyApprovedRooms()
    {
        // Arrange
        var rooms = new List<ChatRoom>
        {
            new() { RequestId = "s1" },
            new() { RequestId = "a1" }
        };

        _chatRepoMock.Setup(r => r.GetRoomsByUserIdAsync("user1"))
            .ReturnsAsync(rooms);

        _sittingRepoMock.Setup(r => r.GetByIdAsync("s1"))
            .ReturnsAsync(new SittingRequest { Id = "s1", Status = RequestStatus.Approved });

        _adoptionRepoMock.Setup(r => r.GetByIdAsync("a1"))
            .ReturnsAsync(new AdoptionRequest { Id = "a1", Status = RequestStatus.Approved });

        // Act
        var result = await _service.GetMyRoomsAsync("user1");

        // Assert
        Assert.That(result.Count(), Is.EqualTo(2));
    }

    [Test]
    public void GetOrCreateRoomAsync_ShouldThrow_WhenUnknownType()
    {
        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(() =>
            _service.GetOrCreateRoomAsync("1", "Unknown", "user1"));
    }

    [Test]
    public void GetOrCreateRoomAsync_ShouldThrow_WhenSittingNotApproved()
    {
        // Arrange
        _sittingRepoMock.Setup(r => r.GetByIdAsync("s1"))
            .ReturnsAsync(new SittingRequest { Id = "s1", Status = RequestStatus.Pending });

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.GetOrCreateRoomAsync("s1", "Sitting", "user1"));
    }

    [Test]
    public void GetOrCreateRoomAsync_ShouldThrow_WhenAdoptionNotApproved()
    {
        // Arrange
        _adoptionRepoMock.Setup(r => r.GetByIdAsync("a1"))
            .ReturnsAsync(new AdoptionRequest { Id = "a1", Status = RequestStatus.Pending });

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.GetOrCreateRoomAsync("a1", "Adoption", "user1"));
    }

    [Test]
    public async Task GetMessagesAsync_ShouldThrow_WhenUserNotInRoom()
    {
        // Arrange
        _chatRepoMock.Setup(r => r.GetRoomByIdAsync("r1"))
            .ReturnsAsync(new ChatRoom
            {
                Id = "r1",
                Participants = new List<string> { "otherUser" }
            });

        // Act & Assert
        Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.GetMessagesAsync("r1", "user1"));
    }

    [Test]
    public async Task SendMessageAsync_ShouldSaveMessageAndUpdateRoom()
    {
        // Arrange
        var room = new ChatRoom
        {
            Id = "r1",
            Participants = new List<string> { "user1" }
        };

        _chatRepoMock.Setup(r => r.AddMessageAsync(It.IsAny<ChatMessage>()))
            .Returns(Task.CompletedTask);

        _chatRepoMock.Setup(r => r.GetRoomByIdAsync("r1"))
            .ReturnsAsync(room);

        _chatRepoMock.Setup(r => r.UpdateRoomAsync("r1", It.IsAny<ChatRoom>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _service.SendMessageAsync("r1", "user1", "hello");

        // Assert
        Assert.That(result.Content, Is.EqualTo("hello"));

        _chatRepoMock.Verify(r => r.AddMessageAsync(It.IsAny<ChatMessage>()), Times.Once);
        _chatRepoMock.Verify(r => r.UpdateRoomAsync("r1", It.IsAny<ChatRoom>()), Times.Once);
    }
}