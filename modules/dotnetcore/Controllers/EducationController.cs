using Microsoft.AspNetCore.Mvc;

namespace Resume
{
  public class EducationController : Controller
  {
    [HttpGet]
    public IActionResult Index()
    {
      return View();
    }
  }
}
