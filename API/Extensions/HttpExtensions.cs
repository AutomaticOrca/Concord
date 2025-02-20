using System;
using System.Text.Json;
using API.Helpers;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader<T>(this HttpResponse response, PagedList<T> data)
    {
        var paginationHeader = new PaginationHeader(
            data.CurrentPage,
            data.PageSize,
            data.TotalCount,
            data.TotalPages
        );

        // camelCase
        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        // The "Pagination" header will contain the JSON-serialized pagination metadata.
        response.Headers.Append(
            "Pagination",
            JsonSerializer.Serialize(paginationHeader, jsonOptions)
        );

        // ensure that the "Pagination" header is exposed to the client
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}
