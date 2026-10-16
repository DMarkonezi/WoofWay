using Moq;
using NUnit.Framework;
using WoofWay.Application.DTOs.Auth;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Services.Auth;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.UnitTests.Features.Auth;

[TestFixture]
public class AuthServiceTests
{
    private Mock<IUserRepository> _userRepoMock;
    private Mock<IShelterRepository> _shelterRepoMock;
    private Mock<IJwtService> _jwtServiceMock;
    private AuthService _authService;

    [SetUp]
    public void Setup()
    {
        _userRepoMock = new Mock<IUserRepository>();
        _shelterRepoMock = new Mock<IShelterRepository>();
        _jwtServiceMock = new Mock<IJwtService>();

        _authService = new AuthService(
            _userRepoMock.Object, 
            _shelterRepoMock.Object, 
            _jwtServiceMock.Object
        );
    }

    [Test]
    public async Task Login_ShouldFail_WhenPasswordIsIncorrect()
    {
        // Arrange
        var request = new LoginRequest ("test@test.com", "wrongpassword");
        var user = new User { Email = "test@test.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpassword") };
        
        _userRepoMock.Setup(r => r.GetByEmailAsync(request.Email)).ReturnsAsync(user);

        // Act
        var result = await _authService.Login(request);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Invalid email or password."));
    }

    [Test]
    public async Task Login_ShouldFail_WhenShelterIsNotVerified()
    {
        // Arrange
        var user = new User { Id = "123", Role = UserRole.Shelter, PasswordHash = BCrypt.Net.BCrypt.HashPassword("password") };
        var request = new LoginRequest ("shelter@test.com", "password");
        
        _userRepoMock.Setup(r => r.GetByEmailAsync(request.Email)).ReturnsAsync(user);
        
        // Simuliramo da azil postoji ali IsVerified = false
        _shelterRepoMock.Setup(r => r.GetByIdAsync(user.Id)).ReturnsAsync(new Shelter { IsVerified = false });

        // Act
        var result = await _authService.Login(request);

        // Assert
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Contains.Substring("pending moderator approval"));
    }
}