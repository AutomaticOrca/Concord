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

## Section 4
