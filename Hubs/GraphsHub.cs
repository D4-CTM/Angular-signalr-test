using Microsoft.AspNetCore.SignalR;

namespace GraphsHub;

public class GraphHub : Hub
{

    private static List<string> CurrentChartOrder = new List<string>
    {
        "Chart 1", "Chart 2", "Chart 3", "Chart 4",
        "Chart 5", "Chart 6", "Chart 7", "Chart 8", "Chart 9"
    };

    public Task<List<string>> GetCurrentChartsOrder()
    {
        return Task.FromResult(CurrentChartOrder);
    }

    public async Task UpdateChartsOrder(List<string> chartTitles)
    {
        CurrentChartOrder = chartTitles;
        await Clients.Others.SendAsync("ReceiveChartsOrder", chartTitles);
    }


//    public async Task UpdateChartsOrder(List<string> chartTitles)
//    {
//        Console.WriteLine($"Chart titles: {chartTitles}");
//        await Clients.Others.SendAsync("ReceiveChartsOrder", chartTitles);
//    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }

}
