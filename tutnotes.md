## Section 2: dotnet API skeleton

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

## Section 3: Angular skeleton

## Section 4: Auth basic

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

## Section 7: Error handling

RequestDelegate: process an HTTP request.
IHostEnvironment: provides information about hosting environment an application is running in.
HttpContext: Encapsulates all HTTP-specific information about an individual HTTP request.
Exception: Message property: Gets a message that describes the current exception.

## Section 8: Extending the API

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

    

Section 10: Updating resources

Section 11: Adding photo upload functionality

`CreatedAtAction` - 

`Lazy Loading` of EntityFramework Core ---> `Eager Loading`

```c#
// AccountController.cs - login - Find the user in db by username
var user = await context
    .Users
    .Include(p => p.Photos)		// Eager Loading
    .FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
```







Section 12: Reactive forms

Section 13: Paging, sorting and filtering

Section 14: Adding the likes feature

Section 15: Adding the Messaging feature

Section 16: Identity and role management

Section 17: Signal R
