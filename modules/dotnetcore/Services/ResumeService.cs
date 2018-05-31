using Microsoft.Extensions.Logging;
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
        private readonly ILogger _logger;

        private ResumeModel _model;

        public ResumeService(ILogger<ResumeService> logger, string baseAddress, string dataPath)
        {
            if (string.IsNullOrWhiteSpace(baseAddress))
            {
                baseAddress = "http://localhost:5000/";
            }
            if (string.IsNullOrWhiteSpace(dataPath))
            {
                dataPath = "/";
            }

            _logger = logger;
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
                var requestUri = $"{_dataPath}data.{lang}.json";

                try
                {
                    _logger.LogInformation($"Request starting GET: {requestUri}");

                    var started = DateTime.Now;

                    var data = await _client.GetStringAsync($"{_dataPath}data.{lang}.json");

                    _model = JsonConvert.DeserializeObject<ResumeModel>(data);

                    var finished = DateTime.Now;
                    var elapsed = finished - started;

                    _logger.LogInformation($"Request finished GET: {requestUri} {elapsed.Milliseconds}ms");
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, $"Request failed GET: {requestUri}");
                }
            }
            return _model;
        }
    }
}
