using Microsoft.AspNetCore.Mvc;
using qot.Models.DTO;
using qot.Models.Domain;
using qot.Services;

namespace qot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController(ILogger<RoomsController> logger, RoomsService roomsService) : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateRoom()
        {
            try
            {
                Room room = roomsService.CreateRoom();
                logger.LogInformation($"Created room {room.RoomCode}");
                // create socket connection here

                return Ok(room);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse(ex.Message));
            }
        }

        //[HttpPost("join")]
        //public IActionResult PostWithId([FromBody] JoinRoomRequest request)
        //{
        //    try
        //    {
        //        Room room = roomsService.JoinRoom(request);
        //        return Ok(room);
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(new ErrorResponse(ex.Message));
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        return NotFound(new ErrorResponse(ex.Message));
        //    }
        //    catch (InvalidOperationException ex)
        //    {
        //        return Conflict(new ErrorResponse(ex.Message));
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.LogError(ex, "Error joining room");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}
    }
}
