using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using WoofWay.Domain.Common;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.Infrastructure.Persistence;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoConnection");
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new ArgumentNullException(nameof(connectionString), "MongoDB Connection string is missing in appsettings.json");
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(decimal)))
        {
            BsonSerializer.RegisterSerializer(typeof(decimal), new DecimalSerializer(BsonType.Decimal128));
            BsonSerializer.RegisterSerializer(typeof(decimal?), new NullableSerializer<decimal>(new DecimalSerializer(BsonType.Decimal128)));
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(BaseEntity)))
        {
            BsonClassMap.RegisterClassMap<BaseEntity>(cm =>
            {
                cm.AutoMap();
                cm.MapIdProperty(e => e.Id)
                  .SetIdGenerator(StringObjectIdGenerator.Instance)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(e => e.CreatedAt)
                  .SetSerializer(new DateTimeSerializer(DateTimeKind.Utc));
                cm.MapProperty(e => e.UpdatedAt)
                  .SetSerializer(new DateTimeSerializer(DateTimeKind.Utc));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(User)))
        {
            BsonClassMap.RegisterClassMap<User>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(u => u.Role)
                  .SetSerializer(new EnumSerializer<UserRole>(BsonType.String));
                cm.UnmapProperty(u => u.FullName);
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(Dog)))
        {
            BsonClassMap.RegisterClassMap<Dog>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(d => d.CreatorId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId))
                  .SetIgnoreIfNull(true);
                cm.MapProperty(d => d.Status)
                  .SetSerializer(new EnumSerializer<DogStatus>(BsonType.String));
                cm.MapProperty(d => d.EventDate)
                  .SetSerializer(new NullableSerializer<DateTime>(new DateTimeSerializer(DateTimeKind.Utc)));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(Shelter)))
        {
            BsonClassMap.RegisterClassMap<Shelter>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(s => s.UserId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(SittingOffer)))
        {
            BsonClassMap.RegisterClassMap<SittingOffer>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(so => so.SitterId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(SittingRequest)))
        {
            BsonClassMap.RegisterClassMap<SittingRequest>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(sr => sr.SittingOfferId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(sr => sr.OwnerId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(sr => sr.DogId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(sr => sr.Status)
                  .SetSerializer(new EnumSerializer<RequestStatus>(BsonType.String));
                cm.MapProperty(sr => sr.StartTime)
                  .SetSerializer(new DateTimeSerializer(DateTimeKind.Utc));
                cm.MapProperty(sr => sr.EndTime)
                  .SetSerializer(new DateTimeSerializer(DateTimeKind.Utc));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(Notification)))
        {
            BsonClassMap.RegisterClassMap<Notification>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(n => n.UserId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(ChatMessage)))
        {
            BsonClassMap.RegisterClassMap<ChatMessage>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(c => c.ChatRoomId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(c => c.SenderId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(ChatRoom)))
        {
            BsonClassMap.RegisterClassMap<ChatRoom>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(cr => cr.RequestId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(cr => cr.Participants); 
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(AdoptionRequest)))
        {
            BsonClassMap.RegisterClassMap<AdoptionRequest>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty(ar => ar.DogId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(ar => ar.AdopterId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(ar => ar.ShelterId)
                  .SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapProperty(ar => ar.Status)
                  .SetSerializer(new EnumSerializer<RequestStatus>(BsonType.String));
            });
        }

        var client = new MongoClient(connectionString);
        var mongoUrl = new MongoUrl(connectionString);
        var databaseName = mongoUrl.DatabaseName ?? "WoofWayDb";

        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    public IMongoCollection<Shelter> Shelters => _database.GetCollection<Shelter>("Shelters");
    public IMongoCollection<Dog> Dogs => _database.GetCollection<Dog>("Dogs");
    public IMongoCollection<SittingOffer> SittingOffers => _database.GetCollection<SittingOffer>("SittingOffers");
    public IMongoCollection<SittingRequest> SittingRequests => _database.GetCollection<SittingRequest>("SittingRequests");
    public IMongoCollection<Notification> Notifications => _database.GetCollection<Notification>("Notifications");
    public IMongoCollection<ChatMessage> ChatMessages => _database.GetCollection<ChatMessage>("ChatMessages");
    public IMongoCollection<ChatRoom> ChatRooms => _database.GetCollection<ChatRoom>("ChatRooms");
    public IMongoCollection<AdoptionRequest> AdoptionRequests => _database.GetCollection<AdoptionRequest>("AdoptionRequests");
}