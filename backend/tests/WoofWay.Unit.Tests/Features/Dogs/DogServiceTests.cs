using Moq;
using NUnit.Framework;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Interfaces.Services.ComputerVision;
using WoofWay.Application.Services;
using WoofWay.Application.DTOs.Dogs;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.UnitTests.Features.Dogs;

[TestFixture]
public class DogServiceTests
{
    private Mock<IDogRepository> _dogRepoMock;
    private Mock<IComputerVisionService> _cvMock;
    private Mock<ICurrentUserService> _currentUserMock;

    private DogService _service;

    [SetUp]
    public void Setup()
    {
        _dogRepoMock = new Mock<IDogRepository>();
        _cvMock = new Mock<IComputerVisionService>();
        _currentUserMock = new Mock<ICurrentUserService>();

        _service = new DogService(
            _dogRepoMock.Object,
            _cvMock.Object,
            _currentUserMock.Object
        );
    }

    [Test]
    public async Task GetAllAsync_ShouldFilterByStatus()
    {
        var data = new List<Dog>
        {
            new() { Id = "1", Status = DogStatus.Lost, LastKnownLocation = "Nis" },
            new() { Id = "2", Status = DogStatus.Spotted, LastKnownLocation = "Belgrade" }
        };

        _dogRepoMock.Setup(r => r.GetQueryable()).Returns(data.AsQueryable());

        var result = await _service.GetAllAsync("Spotted", null);

        Assert.That(result.Data.Count(), Is.EqualTo(1));
    }

    [Test]
    public async Task GetAllAsync_ShouldFilterByCity()
    {
        var data = new List<Dog>
        {
            new() { Id = "1", Status = DogStatus.Lost, LastKnownLocation = "Nis Center" },
            new() { Id = "2", Status = DogStatus.Lost, LastKnownLocation = "Belgrade" }
        };

        _dogRepoMock.Setup(r => r.GetQueryable()).Returns(data.AsQueryable());

        var result = await _service.GetAllAsync(null, "Nis");

        Assert.That(result.Data.Count(), Is.EqualTo(1));
    }

    [Test]
    public async Task GetMyAsync_ShouldReturnOnlyUserDogs()
    {
        var data = new List<Dog>
        {
            new() { Id = "1", CreatorId = "u1" },
            new() { Id = "2", CreatorId = "u2" }
        };

        _dogRepoMock.Setup(r => r.GetQueryable()).Returns(data.AsQueryable());

        var result = await _service.GetMyAsync("u1");

        Assert.That(result.Data.Count(), Is.EqualTo(1));
    }

    [Test]
    public async Task GetByIdAsync_ShouldFail_WhenDogNotFound()
    {
        _dogRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((Dog?)null);

        var result = await _service.GetByIdAsync("1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task CreateAsync_ShouldCreateDog()
    {
        _dogRepoMock.Setup(r => r.CreateAsync(It.IsAny<Dog>()))
            .Returns(Task.CompletedTask);

        var request = new CreateDogRequest("Rex", "Lost", "Husky", "desc", "img", "Nis");

        var result = await _service.CreateAsync(request, "u1");

        Assert.That(result.Success, Is.True);
        _dogRepoMock.Verify(r => r.CreateAsync(It.IsAny<Dog>()), Times.Once);
    }

    [Test]
    public async Task UpdateStatusAsync_ShouldFail_WhenInvalidStatus()
    {
        _dogRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync(new Dog { Id = "1" });

        var result = await _service.UpdateStatusAsync("1", "INVALID");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task DeleteAsync_ShouldFail_WhenDogNotFound()
    {
        _dogRepoMock.Setup(r => r.GetByIdAsync("1"))
            .ReturnsAsync((Dog?)null);

        var result = await _service.DeleteAsync("1");

        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task GetSpottedDogsAsync_ShouldReturnOnlySpotted()
    {
        var data = new List<Dog>
        {
            new() { Id = "1", Status = DogStatus.Spotted },
            new() { Id = "2", Status = DogStatus.Lost }
        };

        _dogRepoMock.Setup(r => r.GetQueryable()).Returns(data.AsQueryable());

        var result = await _service.GetSpottedDogsAsync();

        Assert.That(result.Data.Count(), Is.EqualTo(1));
    }

}