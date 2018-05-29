using Resume.Models;
using System;
using System.Threading.Tasks;

namespace Resume.Services
{
    public interface IResumeService : IDisposable
    {
        Task<ResumeModel> GetResumeAsync(string lang = "en");
    }
}
