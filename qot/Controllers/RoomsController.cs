using Microsoft.AspNetCore.Mvc;
using qot.Models;
using qot.Services;

namespace qot.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomsController(ILogger<RoomsController> logger, RoomsService roomsService) : ControllerBase
    {
        [HttpPost(Name = "CreateNewRoom")]
        public Room Post([FromBody] RoomRequest request)
        {
            Room room = roomsService.CreateRoom(request);
            logger.LogInformation($"Created room {room.RoomCode}");

            return room;
        }
    }

    public record RoomRequest(string Username);
}
