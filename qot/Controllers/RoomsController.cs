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

                return Ok(room);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse(ex.Message));
            }
        }
    }
}
