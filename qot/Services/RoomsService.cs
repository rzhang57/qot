using qot.Controllers;
using qot.Models;
using System;

namespace qot.Services
{
    public class RoomsService(ILogger<RoomsService> logger)
    {

        private readonly int maxUserNameLength = 15, minUserNameLength = 2;
        private readonly Random _random = new();
        private readonly Dictionary<string, Room> _rooms = new();

        public Room CreateRoom(RoomRequest request)
        {
            string roomCode = GenerateRoomCode();

            if (request.Username.Length < minUserNameLength && request.Username.Length > maxUserNameLength)
            {
                throw new ArgumentException($"Username {request.Username} invalid. Usernames must be at least {minUserNameLength} characters long and at most {maxUserNameLength} characters long.");
            }

            var room = new Room()
            {
                RoomCode = roomCode
            };
            room.Users.Add(new User() { Alias = request.Username });
            _rooms.Add(roomCode, room);
            logger.LogInformation($"Room '{roomCode}' added to server by User '{request.Username}'.");

            return room;
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
    }
}
