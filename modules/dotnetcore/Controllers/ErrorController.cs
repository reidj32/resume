using Microsoft.AspNetCore.Mvc;
using Resume.Filters;
using Resume.Models;

namespace Resume.Controllers
{
    [ConfigureBaseHref]
    public class ErrorController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View(new ErrorViewModel());
        }
    }
}
