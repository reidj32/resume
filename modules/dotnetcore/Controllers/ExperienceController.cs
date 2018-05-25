using Microsoft.AspNetCore.Mvc;

namespace Resume
{
  public class ExperienceController : Controller
  {
    [HttpGet]
    public IActionResult Index()
    {
      return View();
    }
  }
}
