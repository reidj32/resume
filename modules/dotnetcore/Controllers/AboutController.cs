using Microsoft.AspNetCore.Mvc;
using Resume.Services;
using System.Threading.Tasks;

namespace Resume.Controllers
{
    public class AboutController : Controller
    {
        private readonly IResumeService _resumeService;

        public AboutController(IResumeService resumeService)
        {
            _resumeService = resumeService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var resume = await _resumeService.GetResumeAsync();

            return View(resume);
        }
    }
}
