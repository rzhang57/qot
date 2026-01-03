using qot.Models.DTO;
using qot.Models.Domain;
using System.Collections.Concurrent;

namespace qot.Services
{
    public class RoomsService(ILogger<RoomsService> logger)
    {

        private readonly int maxUserNameLength = 15, minUserNameLength = 2, minimumLifeTime = 8;
        private readonly Random _random = new();
        private readonly ConcurrentDictionary<string, Room> _rooms = new();
        private readonly ConcurrentDictionary<string, string> _connectionToRoom = new(); // connectionId → roomCode

        public Room CreateRoom()
        {
            string roomCode = GenerateRoomCode();

            var room = new Room()
            {
                RoomCode = roomCode
            };
            _rooms[roomCode] = room;
            logger.LogInformation($"Room '{roomCode}' added to server.");

            return room;
        }

        public Room JoinRoom(JoinRoomRequest request, string connectionId)
        {
            if (!IsValidUsername(request.Username))
            {
                throw new ArgumentException($"Username {request.Username} invalid. Usernames must be at least {minUserNameLength} characters long and at most {maxUserNameLength} characters long.");
            }

            Room room = GetRoom(request.RoomCode);

            if (room.Users.Count >= room.MaxCapacity)
            {
                throw new InvalidOperationException($"Room '{request.RoomCode}' is full.");
            }
            if (room.Users.Any(p => p.Value.Alias.Equals(request.Username, StringComparison.OrdinalIgnoreCase) && !p.Key.Equals(connectionId)))
            {
                throw new InvalidOperationException($"Username '{request.Username}' is already taken in Room '{request.RoomCode}'.");
            }

            room.Users.AddOrUpdate(connectionId, _ => new User() { Alias = request.Username }, (_, __) => new User() { Alias = request.Username });
            _connectionToRoom[connectionId] = request.RoomCode;

            return room;
        }

        public Room GetRoom(string roomCode)
        {
            if (_rooms.TryGetValue(roomCode, out var room))
            {
                return room;
            }
            throw new KeyNotFoundException($"Room with code '{roomCode}' not found.");
        }

        public string? GetRoomCodeByConnectionId(string connectionId)
        {
            if (_connectionToRoom.TryGetValue(connectionId, out var roomCode))
            {
                return roomCode;
            }
            return null;
        }

        public User GetUserByConnectionId(string roomCode, string connectionId)
        {
            var room = GetRoom(roomCode);
            if (room.Users.TryGetValue(connectionId, out var user))
            {
                return user;
            }
            throw new KeyNotFoundException($"User with connection ID '{connectionId}' not found.");
        }

        public void RemoveUser(string roomCode, string connectionId)
        {
            if (_rooms.TryGetValue(roomCode, out var room))
            {
                room.Users.TryRemove(connectionId, out _);
                logger.LogInformation($"User with connection '{connectionId}' removed from room '{roomCode}'.");
            }
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
