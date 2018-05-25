using Microsoft.AspNetCore.Mvc;

namespace Resume
{
  public class AboutController : Controller
  {
    [HttpGet]
    public IActionResult Index()
    {
      return View();
    }
  }
}
