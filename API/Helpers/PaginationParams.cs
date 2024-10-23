using System;

namespace API.Helpers;

public class PaginationParams
{
    private const int MaxPageSize = 50;
    public int PageNumber { get; set; } = 1;
    private int _pageSize = 10;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;

        // get { return _pageSize; }
        // set
        // {
        //     // Ensure that the page size does not exceed the maximum allowed value
        //     if (value > MaxPageSize)
        //     {
        //         _pageSize = MaxPageSize;
        //     }
        //     else
        //     {
        //         _pageSize = value;
        //     }
        // }
    }
}
