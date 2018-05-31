using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Resume.Services;

namespace Resume
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container. For more information
        // on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            var baseAddress = Environment.GetEnvironmentVariable("ASPNETCORE_BASEADDRESS");
            var dataPath = Environment.GetEnvironmentVariable("ASPNETCORE_DATAPATH");

            services.AddMvc();

            services.AddScoped<IResumeService, ResumeService>(factory =>
                new ResumeService(factory.GetService<ILogger<ResumeService>>(), baseAddress, dataPath));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            var baseHref = Environment.GetEnvironmentVariable("ASPNETCORE_BASEHREF");

            if (!string.IsNullOrWhiteSpace(baseHref))
            {
                app.Use(async (context, next) =>
                {
                    context.Request.PathBase = baseHref;
                    await next.Invoke();
                });
            }

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute("default", "{controller=About}/{action=Index}/{id?}");
            });
        }
    }
}
