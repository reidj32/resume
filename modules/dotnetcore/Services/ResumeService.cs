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
        private readonly string _dataPath;

        private ResumeModel _model;

        public ResumeService(string baseAddress, string dataPath)
        {
            if (string.IsNullOrWhiteSpace(baseAddress))
            {
                baseAddress = "http://localhost:5000/";
            }
            if (string.IsNullOrWhiteSpace(dataPath))
            {
                dataPath = "/";
            }

            _dataPath = dataPath;
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
                var data = await _client.GetStringAsync($"{_dataPath}data.{lang}.json");

                _model = JsonConvert.DeserializeObject<ResumeModel>(data);
            }
            return _model;
        }
    }
}
