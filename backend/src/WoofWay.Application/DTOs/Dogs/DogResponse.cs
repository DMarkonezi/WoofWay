    namespace WoofWay.Application.DTOs.Dogs;

    using System.Text.Json.Serialization;
using WoofWay.Domain.Enums;

public class DogResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("creatorId")]
        public string CreatorId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("breed")]
        public string Breed { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("imageUrl")]
        public string ImageUrl { get; set; }

        [JsonPropertyName("location")]
        public string Location { get; set; }

        [JsonPropertyName("EventDate")]
        public DateTime? EventDate { get; set; }


        // Za UI logiku prilikom otvaranja chat-a 

        [JsonPropertyName("adoptionRequestStatus")]

        public RequestStatus? AdoptionRequestStatus { get; set; }
        [JsonPropertyName("adoptionRequestId")]
        public string? AdoptionRequestId { get; set; }

        public DogResponse(string id, string creatorId, string name, string status, string breed, string description, string imageUrl, string location, DateTime? eventDate)
        {
            Id = id;
            CreatorId = creatorId;
            Name = name;
            Status = status;
            Breed = breed;
            Description = description;
            ImageUrl = imageUrl;
            Location = location;
            EventDate = eventDate;
        }

        public DogResponse(
            string id, 
            string creatorId, 
            string name, 
            string status, 
            string breed, 
            string description, 
            string imageUrl, 
            string location, 
            DateTime? eventDate, 
            RequestStatus? adoptionRequestStatus,
            string? adoptionRequestId
            )
        {
            Id = id;
            CreatorId = creatorId;
            Name = name;
            Status = status;
            Breed = breed;
            Description = description;
            ImageUrl = imageUrl;
            Location = location;
            EventDate = eventDate;
            AdoptionRequestStatus = adoptionRequestStatus;
            AdoptionRequestId = adoptionRequestId;
        }
    }