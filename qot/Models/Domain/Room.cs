using System.Collections.Concurrent;

namespace qot.Models.Domain
{
    public class Room
    {
        public string RoomCode { get; set; } = "";
        public ConcurrentDictionary<string, User> Users { get; set; } = new();
        public string MarkdownContent { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int MaxCapacity { get; set; } = 10;
    }
}