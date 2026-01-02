using Microsoft.AspNetCore.Mvc;
using qot.Models;
using qot.Services;

namespace qot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController(ILogger<RoomsController> logger, RoomsService roomsService) : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateRoom([FromBody] RoomRequest request)
        {
            try
            {
                Room room = roomsService.CreateRoom(request);
                logger.LogInformation($"Created room {room.RoomCode}");
                // create socket connection here

                return Ok(room);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("join")]
        public IActionResult PostWithId([FromBody] JoinRoomRequest request)
        {
            try
            {
                Room room = roomsService.JoinRoom(request);
                return Ok(room);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error joining room");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public record RoomRequest(string Username);
    public record JoinRoomRequest(string Username, string RoomCode);
}
