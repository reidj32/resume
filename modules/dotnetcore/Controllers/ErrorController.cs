using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Resume.Filters;
using Resume.Models;

namespace Resume.Controllers
{
    [ConfigureBaseHref]
    public class ErrorController : Controller
    {
        private readonly ILogger _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            _logger.LogError("Unknown error occurred.");

            return View(new ErrorViewModel());
        }
    }
}
