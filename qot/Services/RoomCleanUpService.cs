
namespace qot.Services
{
    public class RoomCleanUpService(ILogger<RoomCleanUpService> logger, RoomsService roomsService) : BackgroundService
    {
        private readonly TimeSpan _interval = TimeSpan.FromHours(1);

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(_interval, stoppingToken);
                logger.LogInformation("Running room cleanup task");
                roomsService.CleanupEmptyRooms();
            }
        }
    }
}
