using Amazon.Lambda.AspNetCoreServer;

namespace API;

public class LambdaEntryPoint : APIGatewayProxyFunction
{
    protected override void Init(IWebHostBuilder builder)
    {
        builder.UseStartup<Program>(); 
    }
}