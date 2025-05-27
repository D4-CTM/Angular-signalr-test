using Microsoft.AspNetCore.Mvc;

namespace Angular_test.TodoAppController;

[ApiController]
[Route("[controller]")]
public class TodoAppController : ControllerBase
{
    private static readonly List<TodoItems> todoItems = new List<TodoItems>{
        new TodoItems{
            taskName = "Add items",
            doDate = DateTime.Now,
        },
    };

    private readonly ILogger<TodoAppController> _logger;

    public TodoAppController(ILogger<TodoAppController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IEnumerable<TodoItems> Get()
    {
        return todoItems.ToArray();
    }

    [HttpPost]
    public void Post(TodoItems todoItem)
    {
        todoItems.Add(todoItem);
    }

    [HttpPut]
    public void Put([FromBody] string taskName) 
    {
        todoItems.ForEach(item => {
            if (item.taskName == taskName) item.taskDone = true;
        });
    }
}

