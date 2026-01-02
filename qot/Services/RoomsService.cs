using qot.Controllers;
using qot.Models;
using System.Collections.Concurrent;

namespace qot.Services
{
    public class RoomsService(ILogger<RoomsService> logger)
    {

        private readonly int maxUserNameLength = 15, minUserNameLength = 2, minimumLifeTime = 8;
        private readonly Random _random = new();
        private readonly ConcurrentDictionary<string, Room> _rooms = new();

        public Room CreateRoom(RoomRequest request)
        {
            string roomCode = GenerateRoomCode();

            if (IsValidUsername(request.Username))
            {
                throw new ArgumentException($"Username {request.Username} invalid. Usernames must be at least {minUserNameLength} characters long and at most {maxUserNameLength} characters long.");
            }

            var room = new Room()
            {
                RoomCode = roomCode
            };
            room.Users.Add(new User() { Alias = request.Username });
            _rooms[roomCode] = room;
            logger.LogInformation($"Room '{roomCode}' added to server by User '{request.Username}'.");

            return room;
        }

        public Room JoinRoom(JoinRoomRequest request)
        {
            if (!IsValidUsername(request.Username))
            {
                throw new ArgumentException($"Username {request.Username} invalid. Usernames must be at least {minUserNameLength} characters long and at most {maxUserNameLength} characters long.");
            }

            try
            {
                Room room = GetRoom(request.RoomCode);
                if (room.Users.Count >= room.MaxCapacity)
                {
                    throw new InvalidOperationException($"Room '{request.RoomCode}' is full.");
                }
                if (room.Users.Any(u => u.Alias.Equals(request.Username, StringComparison.OrdinalIgnoreCase)))
                {
                    throw new InvalidOperationException($"Username '{request.Username}' is already taken in Room '{request.RoomCode}'.");
                }
                room.Users.Add(new User() { Alias = request.Username });
                logger.LogInformation($"User '{request.Username}' joined Room '{request.RoomCode}'.");
                return room;
            }
            catch (KeyNotFoundException)
            {
                throw new KeyNotFoundException($"Room with code '{request.RoomCode}' does not exist.");
            }
        }

        public Room GetRoom(string roomCode)
        {
            if (_rooms.TryGetValue(roomCode, out var room))
            {
                return room;
            }
            throw new KeyNotFoundException($"Room with code '{roomCode}' not found.");
        }

        public void CleanupEmptyRooms()
        {
            var emptyRooms = _rooms
                .Where(r => r.Value.Users.Count == 0 && DateTime.UtcNow.CompareTo(r.Value.CreatedAt.AddHours(minimumLifeTime)) > 0)
                .Select(r => r.Key).ToList();

            foreach (var roomCode in emptyRooms)
            {
                _rooms.TryRemove(roomCode, out _);
                logger.LogInformation($"Removed empty room '{roomCode}'");
            }
        }

        private string GenerateRoomCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            string code;
            do
            {
                code = new string(Enumerable.Range(0, 6)
                    .Select(_ => chars[_random.Next(chars.Length)])
                    .ToArray());
            } while (_rooms.ContainsKey(code));

            return code;
        }

        private bool IsValidUsername(string username)
        {
            return username.Length >= minUserNameLength && username.Length <= maxUserNameLength;
        }
    }
}
