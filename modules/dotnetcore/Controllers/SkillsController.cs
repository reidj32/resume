using Microsoft.AspNetCore.Mvc;
using Resume.Filters;
using Resume.Services;
using System.Threading.Tasks;

namespace Resume.Controllers
{
    [ConfigureBaseHref]
    public class SkillsController : Controller
    {
        private readonly IResumeService _resumeService;

        public SkillsController(IResumeService resumeService)
        {
            _resumeService = resumeService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var model = await _resumeService.GetResumeAsync();

            return View(model);
        }
    }
}
