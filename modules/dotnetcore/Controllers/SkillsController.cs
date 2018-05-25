using Microsoft.AspNetCore.Mvc;

namespace Resume
{
  public class SkillsController : Controller
  {
    [HttpGet]
    public IActionResult Index()
    {
      return View();
    }
  }
}
