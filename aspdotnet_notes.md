# Section 2: dotnet API skeleton

6. dotnet CLI
   dotnet --info
   dotnet -h

sln
`dotnet new sln`
`dotnet new webapi -h` help cmd
`dotnet new webapi -controllers -n API`
dotnet sln add API
dotnet sln list

7. setting up vscode
   command shift p
   extension: C# dev kit, nuget gallery, sqlite

8. getting to know the api project files
   in /API `dotnet run` controllers/weatherBlahBlah.cd route
   SolutionExploerer/launchSettings.json
   "$schema": "http://json.schemastore.org/launchsettings.json",
   solution exploerer launchSettings.json profiles launchBrowser set to false
   applicationUrl setting http5000; https5001 (`sudo dotnet dev-certs https --trust`)
   _API.csproject_
   _API.http_
   `dotnet watch`

9. creating entity
   mkdir in SolutionExplorer API/Entities/AppUser.cs
   C# is case sensitive language
   nullable

10. Intro to Entity Framework
    Entity Framework: translate our code into SQL (Querying, Change Tracking, Saving the db, concurrency, transcations, caching, built-in conventions, configurations, migrations, )
    SQLite: we don't need to install a db server, sqlite just uses a file to store our db. (not production worthy but a great db for dev because it's very portable, works on any OS)

11. Adding EntityFramework to our prj
    nugetGallery install Microsoft.EntityFrameworkCore.Sqlite

12. Adding a DbContext class
    entities'id should be 'Id'
    DataContext.cs
    Read docs:
    - C# construction: steps when initializing a new instance.
    - DbContext Class: session - DbContext Lifetime, Configuration, and Initialization: have not read yet, looks very hard to understand.
    - DbSet: the collections of all entities in the context, or that can be queried from the db, of a given type.

solution explorers/appsettings.json/appsettings.development.json "ConnectionStrings"
migration: `dotnet tool list -g`
nuget: dotnet-ef, version, synchronizing the structure of db through code changes. (If modify model classes, changes need to be relected in the db. at this point, use ef core's migration feature to generate the corresponding db scripts)
`dotnet ef migrations -h`
`dotnet ef migrations add InitialCreate -o Data/Migrations`
\_initialCreate.cs: Up, Down

14. Creating the db using Entity Framework Code first migrations
    `dotnet ef database update`
    appsettings.Development.json: "Microsoft.AspNetCore": "Information"
    sqlite explorer: cmd shift p, open db

15. Adding a new API controller
    read docs:

    - ApiController attribute

16. Making our code Asynchronous
    use synchronous code might block the thread
    if we're using async code with the same number of threads, it's capable of handling much more requests because it can delegate the task to other threads and still respond to other requests.



# Section 4: Auth basic

30. Safe storage of passwords
    hashing and salting(scramble the hash)
    why not ASP.NET identity? later, a lot of work
    why store pwd slat in the db? later to ASP.NET identity

31. Updating the user entity

```shell
dotnet ef migrations add UserEntityUpdated
dotnet ef database update
```

30. Creating a base API controller
    SolutionExplorer/Linkedin/API/Controllers/ new class BaseApiControllers

    read docs:
    Overview of ASP.NET Core MVC
    Model-View-Controller
    Model: core data layer of the system, focusing on the structure and operations of the data, without concerning itself with the user interface or user requests. The Model handles all tasks related to data, including fetching data from the db, uopdating data, and processing business logic.
    View: presenting the user interface and displaying data to the user
    Controller: The controller acts as a bridge between the Model and the View. It handles user requests, calls the appropriate Model to process the data, and choose the proper View to display the results to the user.

31. Creating an Account Controller with a register endpoint
    baseapi namespace api.controller;
    using api.controller, namespace api.controller; difference.
    read docs:

- C# using directive: The using directive allows you to use types defined in a namespace without specifying the fully qualified namespace of that type.
- C# namespace: The `namespace` keyword is used to declare a scope that contains a set of related objects. You can use a namespace to organize code elements and to create globally unique types.
  `File scoped namespace declarations` enable you to declare that all types in a file are in a single namespace.
  using var hmac
- .NET Clean up unmanaged resources/Use objects that implement IDisposable: the using statement in C# simplify the code that you must write to cleanup an object. The using statement obtains one or more resources, executes the statements that you specify, and automatically disposes of the object (read code in the try/finally part in this doc)
- C# Asynchronous programming scenarios:I/O-bound example: Download data from a web service
- Create web APIs with ASP.NET Core

32. Using DTOs
    data transfer object
    [Required] [MaxLength(100)] data nnotation valiadator
    Read docs:

- EntityFramework: AnyAsync, Asynchronously determines whether a sequence contains any elements; Asynchronously determines whether any element of a sequence satisfies a condition.
-

33. Using the debugger
    api
    debug console
    Read docs:

- VS Code Debugging, C#

34. Adding a login endpoint
    DTO/LoginDto, firstordefaultasync, singleordefault,

**Password Hash and Salt**
Register: dtoRegisterPassword ---(HMACSHA512 and SaltKey)---> Hash&SaltedRegisterPassword
Login: dtoLoginPassword ---(HMACSHA512 and SaltKey)---> get Hash&SaltedLoginPassword -----> compare Hash&SaltedLoginPassword and Hash&SaltedRegisterPassword byte by byte

docs:

- EntityFramework, QueryableExtensions.FirstOrDefaultAsync Method:
  Asynchronously returns the first element of a sequence, or a default value if the sequence contains no elements.
- .NET 8, Enumerable.SingleOrDefault Method: Returns the only element of a sequence, or a default value if the sequence is empty; this method throws an exception if there is more than one element in the sequence.
- .NET 8, HMACSHA512 Class: Computes a Hash-based Message Authentication Code (HMAC) using the SHA512 hash function.

35. JSON web tokens
    Json Web Token:
    Industry Standard for tokens
    Self-contained and can contain: credentials, claims, other information

36. Adding a token service
    Interfaces/ITokenService.cs (interface)
    Services/TokenService.cs (class)
    Program.cs builder.Services.
    AddSingleton (singleton services are created the first time they are requested. this type of lifetime is good for when we want to cache data or maintain a state that should be shared across the whole application)
    /AddTransient (transient lifetime services are created each time they are requested from the service container, works for lightweight, stateless services.)
    /AddScoped<ITokenService, TokenService>()

- **Why AddScoped**: life cycle of services is scooped. services are created once per client http request. So for our token service because we want it to generate a token, when this request is received by our API controller and inside our account controller, when we use dependency injection we're going to be injecting our token service here. So the request comes in to the register or the login endpoint, Our new service will be created, we'll get the token and return the token. When this request is finished then our services will be disposed of that we're injecting into this controller.
- why <iTokenService, TokenService>: Dependency injection,

docs:

- Dependency injection in ASP.NET Core: By using the DI pattern, the controller
  - Doesn't use the concrete type MyDependency, only the IMyDependency interface it implements. That makes it easy to change the implementation without modifying the controller or Razor Page.
  - Doesn't create an instance of MyDependency, it's created by the DI container.
- Interface
  - An interface contains definitions for a group of related functionalities that a non-abstract [`class`](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/class) or a [`struct`](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/struct) must implement. An interface may define `static` methods, which must have an implementation. An interface may define a default implementation for members. An interface may not declare instance data such as fields, auto-implemented properties, or property-like events.
  - By using interfaces, you can, for example, **include behavior from multiple sources in a class**. That capability is important in C# because the language doesn't support multiple inheritance of classes. In addition, you must use an interface if you want to **simulate inheritance for structs**, because they can't actually inherit from another struct or class.
  - An interface can't be instantiated directly. Its members are implemented by any class or struct that implements the interface.
  - **A class or struct can implement multiple interfaces**. A class can inherit a base class and also implement one or more interfaces.
- Auto-Implemented Properties: the compiler creates a private, anonymous backing field that can only be accessed through the property's get and set accessors.

37. Adding the create token logic???
    SymmetricSecurityKey
    Claim
    SigningCredentials
    SecrurityAlgorithm,
    read docs:

- ClaimTypese Class

38. Creating a User DTO and returning the token
    DTO (Data Transfer Object) is used to send data between the client (like a web app) and the server (back-end system). Instead of sending all the details from the database, DTOs are used to send just the needed information to keep things secure and efficient.
    class Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute:
    Specifies that the class or method that this attribute is applied to does not require authorization.
    class Microsoft.AspNetCore.Authorization.AuthorizeAttribute (+ 2 overloads):
    Specifies that the class or method that this attribute is applied to requires the specified authorization. 39. Adding the authentication middleware

39. Adding extension methods
    static: use method inside class without creating a new instance of this class.

# Section 7: Error handling

RequestDelegate: process an HTTP request.
IHostEnvironment: provides information about hosting environment an application is running in.
HttpContext: Encapsulates all HTTP-specific information about an individual HTTP request.
Exception: Message property: Gets a message that describes the current exception.

# Section 8: Extending the API

81. Entity Framework relationship
    create a new table called Photos
    `dotnet ef migrations add UpdatedUserEntity`
82. Seeding data
    Data seeding is the process of populating a database with an initial set of data.
    `dotnet ef database drop`

read docs:
entity framework core: Introduction to relationships, Mapping relationships in ef core, navigation property

85. the repository pattern
    a repository mediates between the domain and data mapping layers, acting like an in-memory domain object collection.

86. create a repository

87. updating the users controller
    Photos are not showned in fetched data by default: EntityFramework is lazy by default, and unless we ask for a related entity, it's not gonna automatically give to us.

    System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. photo->appUser->photo->appUser... ====> use Dto

91. Configuring AutoMapper

    **Specify the destination member**:

    - We'll say `D` for destination, which maps to `D.PhotoUrl`, a property inside our `MemberDTO`.

    **Give it the options and specify where to map from**:

    - We use `O` for options, and then specify `MapFrom`. Inside the parentheses, we define the source.
    - We'll say `S` for source, which maps to `S.Photos`, then use `FirstOrDefault()`. Inside, we use a lambda expression to fetch the `IsMain` photo.

    **Lambda expression**:

    - The expression is `x => x.IsMain`, and we access the `URL` property.

    **Handling null reference warnings**:

    - Since Automapper doesn't accommodate null reference types, we’ll get a warning. If the user has no photos, Automapper will set the `PhotoUrl` property to `null`. To remove this compiler warning, we use the **null-forgiving operator** (the exclamation mark `!`), which tells the compiler it's okay because Automapper will set `PhotoUrl` to `null` instead of throwing an exception.

    **Null reference handling explanation**:

    - If there’s no photo, `IsMain` won’t exist. So, if we try to access the `URL`, the compiler is right to warn about a potential null reference error. However, Automapper will just set `PhotoUrl` to `null` if the source is `null`, preventing any exception.

    ```
    // API/Helpers/AutoMapperProfiles.cs
    
    using System;
    using API.DTOs;
    using API.Entities;
    using AutoMapper;
    
    namespace API.Helpers;
    
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(
                    d => d.PhotoUrl,
                    o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain)!.Url)
                );
            CreateMap<Photo, PhotoDto>();
        }
    }
    
    ```

    

# Section 10: Updating resources



# Section 11: Adding photo upload functionality

`CreatedAtAction` - Creates a [CreatedAtActionResult](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.createdatactionresult?view=aspnetcore-8.0) object that produces a [Status201Created](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.statuscodes.status201created?view=aspnetcore-8.0#microsoft-aspnetcore-http-statuscodes-status201created) response.

`Lazy Loading` of EntityFramework Core ---> `Eager Loading`

```c#
// AccountController.cs - login - Find the user in db by username
var user = await context
    .Users
    .Include(p => p.Photos)		// Eager Loading
    .FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
```



# Section 12: Reactive forms

Required



```C#
using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public required string Username { get; set; } = string.Empty;


    [Required]
    [StringLength(8, MinimumLength = 4)]
    public required string Password { get; set; } = string.Empty;
}

```



AutoMapper 



Required member 'UserDto.UserName' must be set in the object initializer or attribute constructor.



# Section 13: Paging, sorting and filtering

pagination

pass the pagination parameters via a query string

Page size: 

deferred execution: build up a tree expressions inside Entity Framework for our query. We build up an expression tree and we store this as an eye variable of type.



`IQueryable<User>`

```C#
var query = context.Users
	.Where(x => x.Gender == gender)
	.OrderBy(x => x.UserName)
	.Take(5)
	.Skip(5)
  .AsQueryable()
```



`Execution`

```C#
query.ToListAsync()
query.ToArrayAsync()
query.ToDictionary()

query.Count()
```



- [Microsoft Docs - IQueryable Interface](https://learn.microsoft.com/en-us/dotnet/api/system.linq.iqueryable?view=net-7.0)
- [Microsoft Docs - Entity Framework Paging](https://learn.microsoft.com/en-us/ef/core/querying/pagination)

- [Microsoft Docs - Expression Trees in .NET](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/expression-trees/)
- [Microsoft Docs - LINQ (Language Integrated Query)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)



/Helpers/PagedList:  Pagination from Database

/Helpers/PaginationHeader: Pagination request from client side to server



415 Unsupported Media Type -----> [FromQuery]

```C#
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers(
        [FromQuery] UserParams userParams
    )
    {
				......
    }
```



UsersController.cs

```C#
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers(
        [FromQuery] UserParams userParams
    )
    {
        userParams.CurrentUsername = User.GetUsername();
				......
    }
```





> API/Extensions/ClaimsPrincpleExtensions.cs
>
> - [Microsoft Docs - Extension Methods](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)







```C#
public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
      public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var query = context.Users.AsQueryable();
        query = query.Where(x => x.UserName != userParams.CurrentUsername);
				......
    }

}
```

DbSet and IDbSet implement IQueryable and so can be used as the starting point for writing a LINQ query against the database.



Action Filter

> - [Action Filters in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-7.0)
>
> *Filters* in ASP.NET Core allow code to run before or after specific stages in the request processing pipeline.
>
> Built-in filters handle tasks such as:
>
> - Authorization, preventing access to resources a user isn't authorized for.
> - Response caching, short-circuiting the request pipeline to return a cached response.



LogUserActivity



Helper/PagedList.cs/createAsync

```cs
using System;
using System.Diagnostics;
using API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PagedList<T> : List<T>
{
    public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        PageSize = pageSize;
        TotalCount = count;
        AddRange(items);
    }

    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public static async Task<PagedList<T>> CreateAsync(
        IQueryable<T> source,
        int pageNumber,
        int pageSize
    )
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
```

`CountAsync` is used to asynchronously calculate the total count.

By using `Skip` to skip the records that have already been displayed 
and then using `Take` to retrieve the records for the current page, this approach effectively reduces the amount of data queried each time, returning only the portion of data requested by the user.



API/Helper/PaginationParams.cs	client ---> server: client tells server how to pagination

API/Helper/PaginationHeader.cs	server ---> client: server tells client pagination metadata





# Section 14: Adding the likes feature

**Intro**

Many to Many Relationships:

AppUser   ------(can be liked by many)----> AppUser

​		<------(can like many)---------------- 



| SourceUserId | LikedUsesrId |
| ------------ | ------------ |
| 1            | 7            |
| 1            | 8            |



`AppUser` has one `SourceUser` with many `LikedUsers`

`AppUser` has one `LikedUser` with many `LikedByUsers`



**CodeFirst**

focus on the domain of your application and start creating classes for your domain entity rather than design your database first and then create the classes which match your database design.



**Adding a likes entity**

Entity/AppUser.cs

```C#
using System;

namespace API.Entities;

public class AppUser
{
		...
    public List<AppUser> LikedByUsers { get; set; } = [];
    public List<AppUser> LikedUsers { get; set; } = [];
}

```



API/Data/DataContext.cs

```csharp
using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// This class inherits from DbContext, which is the Entity Framework Core context class used to interact with the database.
public class DataContext(DbContextOptions options) : DbContext(options)
{
    // Defines two DbSets representing tables in the database: AppUser and UserLike.
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }

    // OnModelCreating method is used to configure relationships, keys, and other database rules for entities.
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Call the base OnModelCreating method to ensure default behaviors are inherited.
        base.OnModelCreating(builder);

        // Define the primary key for the UserLike entity, which is a composite key consisting of SourceUserId and TargetUserId.
        builder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.TargetUserId });

        // Configure a one-to-many relationship between UserLike and SourceUser.
        // A user can like many users (LikedUsers).
        builder
            .Entity<UserLike>()                       // Configure the UserLike entity
            .HasOne(s => s.SourceUser)                // A UserLike is associated with one SourceUser
            .WithMany(l => l.LikedUsers)              // A SourceUser can be associated with many LikedUsers
            .HasForeignKey(s => s.SourceUserId)       // Foreign key is SourceUserId
            .OnDelete(DeleteBehavior.Cascade);        // If the SourceUser is deleted, cascade delete the related UserLike records.

        // Configure a one-to-many relationship between UserLike and TargetUser.
        // A user can be liked by many users (LikedByUsers).
        builder
            .Entity<UserLike>()                       // Configure the UserLike entity
            .HasOne(s => s.TargetUser)                // A UserLike is associated with one TargetUser
            .WithMany(l => l.LikedByUsers)            // A TargetUser can be associated with many LikedByUsers
            .HasForeignKey(s => s.TargetUserId)       // Foreign key is TargetUserId
            .OnDelete(DeleteBehavior.Cascade);        // If the TargetUser is deleted, cascade delete the related UserLike records.
    }
}


```



```shell
dotnet ef migrations add UserLikesAdded
```



**Adding a likes repository**

API/Interfaces/ILikesRepository.cs

API/Data/LikesRepository.cs

API/Extensions/ApplicationServiceExtensions.cs

```csharp
public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        ......
        services.AddScoped<ILikesRepository, LikesRepository>();
				......
    }
}

```





# Section 15: Adding the Messaging feature

many to many to many relationships



user can receive many messages and can send many messages --> join table between users 





**Setting up the entities for message**

Entity/Message.cs

```cs
using System;

namespace API.Entities;

public class Message
{
    public int Id { get; set; }
    public required string SenderUsername { get; set; }
    public required string RecipientUsername { get; set; }
    public required string Content { get; set; }
    public DateTime? DateRead { get; set; }
    public DateTime MessageSent { get; set; } = DateTime.UtcNow;
    public bool SenderDeleted { get; set; }
    public bool RecipientUsernameDeleted { get; set; }

    // navigation properties
    public int SenderId { get; set; }
    public AppUser Sender { get; set; } = null!;
    public int RecipientId { get; set; }
    public AppUser Recipient { get; set; } = null!;
}
```



API/Entities/AppUser.cs

```cs
using System;

namespace API.Entities;

public class AppUser
{
		......
		public List<Message> MessagesSent { get; set; } = [];
    public List<Message> MessagesReceived { get; set; } = [];
}

```



API/Data/DataContext.cs

```cs
using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// DbContext class for database interaction
public class DataContext(DbContextOptions options) : DbContext(options)
{
    // DbSets representing tables
		......
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
				......
        builder
            .Entity<Message>()
            .HasOne(x => x.Recipient)
            .WithMany(x => x.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
```



```shell
dotnet ef migrations add MessageEntityAdded
```



# 16. Setting up the message repository

**Intro**

> .NET Identity
> Role Management
> Policy based authorisation
> UserManager<T>
> SiginInManager<T>
> RoleManager<T>



Setting up the entities

Join table between `AppUser` and `AppRole`  ---> `AppUserRole`





Configuring the DbContext



Configuring the startup class



Refactoring and adding a new migration



Updating the seed method

```shell
dotnet ef database drop
```





Updating the account controller

202 6分钟 debug



Adding roles to the app



Adding the roles to the JWT token



Adding policy based authorisation



Getting the users with roles



Editing user roles



Adding an admin component



Adding an admin guard



Adding a custom directive



Adding the edit roles component



Setting up modals



Editing roles part two





Setting up the automapper profiles



Adding a message controller



Getting the messages from the Repo



Getting the message thread for 2 users



Deleting messages on the API











Section 16: Identity and role management

Section 17: Signal R
