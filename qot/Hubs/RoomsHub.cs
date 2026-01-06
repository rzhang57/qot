using Microsoft.AspNetCore.SignalR;
using qot.Models.DTO;
using qot.Services;

namespace qot.Hubs
{
    public class RoomsHub(ILogger<RoomsHub> logger, RoomsService roomsService) : Hub
    {
        private readonly RoomsService _roomsService = roomsService;
        
        public async Task JoinRoom(string roomCode, string username)
        {
            try
            {
                roomsService.JoinRoom(new JoinRoomRequest(username, roomCode), Context.ConnectionId);
                await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);

                var room = roomsService.GetRoom(roomCode);
                await Clients.Group(roomCode).SendAsync("UserJoined", username, room.Users.Count);

                logger.LogInformation("User {username} joined room {roomCode}", username, roomCode);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error joining room");
                await Clients.Caller.SendAsync("JoinError", ex.Message);
                return;
            }
        }

        public async Task SendMarkdownUpdate(string roomCode, string content)
        {
            try
            {
                verifyRoomMembership(roomCode);
                
                var room = roomsService.GetRoom(roomCode);
                room.MarkdownContent = content;
                await Clients.OthersInGroup(roomCode).SendAsync("MarkdownUpdated", content);
            } catch (UnauthorizedAccessException)
            {
                await Clients.Caller.SendAsync("Unauthorized", "Not a member of the room");
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            try
            {
                var roomCode = roomsService.GetRoomCodeByConnectionId(Context.ConnectionId);

                if (roomCode != null)
                {
                    var user = roomsService.GetUserByConnectionId(roomCode, Context.ConnectionId);
                    roomsService.RemoveUser(roomCode, Context.ConnectionId);

                    await Clients.Group(roomCode).SendAsync("UserLeft", user.Alias);
                    logger.LogInformation("User {user.Alias} disconnected from room {roomCode}", user.Alias, roomCode);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error handling disconnect");
            }

            await base.OnDisconnectedAsync(exception);
        }
        
        private void verifyRoomMembership(string roomCode)
        {
            var senderRoom = _roomsService.GetRoomCodeByConnectionId(Context.ConnectionId);
            if (senderRoom == null || senderRoom != roomCode)
            {
                logger.LogWarning("Connection '{ConnectionId}' attempted to update room {RoomCode} but is in {SenderRoom}", Context.ConnectionId, roomCode, senderRoom);
                throw new UnauthorizedAccessException($"ConnectionId {Context.ConnectionId} not a valid member of the room");
            }
        }
    }
}
