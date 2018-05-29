using Newtonsoft.Json;
using Resume.Models;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Resume.Services
{
    public class ResumeService : IResumeService
    {
        private bool _disposed;
        private readonly HttpClient _client;

        private ResumeModel _model;

        public ResumeService(string baseAddress)
        {
            _client = new HttpClient
            {
                BaseAddress = new Uri(baseAddress)
            };
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            _client.Dispose();
            _disposed = true;
        }

        public async Task<ResumeModel> GetResumeAsync(string lang = "en")
        {
            if (_model == null)
            {
                var data = await _client.GetStringAsync($"/i18n/data.{lang}.json");

                _model = JsonConvert.DeserializeObject<ResumeModel>(data);
            }
            return _model;
        }
    }
}
