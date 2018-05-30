using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Resume.Filters
{
    public class ConfigureBaseHrefAttribute : Attribute, IFilterFactory
    {
        public IFilterMetadata CreateInstance(IServiceProvider serviceProvider)
        {
            IConfiguration configuration = serviceProvider.GetService<IConfiguration>();

            return new ConfigureBaseHrefFilter(configuration.GetValue<string>("BaseHref"));
        }

        public bool IsReusable => true;

        private class ConfigureBaseHrefFilter : IActionFilter
        {
            private readonly string _baseHref;

            public ConfigureBaseHrefFilter(string baseHref)
            {
                _baseHref = baseHref;
            }

            public void OnActionExecuting(ActionExecutingContext context)
            {
                ((Controller)context.Controller).ViewData["BaseHref"] = _baseHref;
            }

            public void OnActionExecuted(ActionExecutedContext context)
            {
            }
        }
    }
}
