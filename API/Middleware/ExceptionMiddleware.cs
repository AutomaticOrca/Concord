using System;
using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env
)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // pass the request to the next middleware in the pipeline
            await next(context);
        }
        // catch unhandled exceptions and returns appropriate responses
        catch (Exception ex)
        {
            // Formats and writes an error log message. to console? aws cloudwatch? azure monitor?
            logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            // set response code 500 (Internal Server Error)
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            //
            var response = env.IsDevelopment()
                ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace)
                : new ApiException(
                    context.Response.StatusCode,
                    ex.Message,
                    "Internal server error"
                );

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}
