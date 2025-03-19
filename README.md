## **Project Overview**

**Project Name**: LinkedIn API Clone

**Description**:  
This project is a social networking API developed using ASP.NET Core, offering features such as user management, messaging, liking other users, and basic social interactions. The architecture follows a layered design, leveraging Entity Framework Core and JWT authentication to ensure efficiency and security.

**Objective**:  
To provide a flexible and scalable API framework that supports social networking features, suitable for both cloud and on-premise deployment.

---

## **Tech Stack**

- **Framework**: ASP.NET Core 8.0
- **ORM**: Entity Framework Core
- **Database**: SQLite (for development) with support for SQL Server, PostgreSQL, and MySQL.
- **Cloud Service**: Cloudinary (for photo uploads)
- **Authentication**: JSON Web Tokens (JWT)
- **Dependency Management**: NuGet
- **Other Tools**: AutoMapper, Pagination utilities, Logging middleware.

---

## **System Architecture Design**

### **Layered Architecture**

The project follows a typical layered architecture with the following components:

1. **Controllers Layer**

   - Handles HTTP requests and responses.
   - Invokes the Service Layer for business logic.
   - Returns Data Transfer Objects (DTOs) to the client.

2. **Service Layer**

   - Contains core business logic.
   - Encapsulates data access logic.
   - Uses interfaces to define services for extensibility and testability.

3. **Data Access Layer**

   - Includes database context (`DataContext`) and repositories.
   - Implements CRUD operations on the database.
   - Follows the Repository Pattern for clear data access interfaces.

4. **Entities Layer**

   - Defines database models.
   - Maps database tables using Entity Framework Core.

5. **Helpers & Extensions**
   - Provides utility classes for tasks like pagination and mapping.
   - Implements custom extension methods.

---

## **Core Feature Design**

### **User Management**

- **Registration & Login**:

  - **Endpoints**: `/api/account/register`, `/api/account/login`
  - **DTOs**: `RegisterDto`, `LoginDto`
  - **Logic**:
    - Validate user uniqueness during registration.
    - Generate JWT tokens during login.
  - **Related Files**:
    - `AccountController.cs`
    - `UserRepository.cs`
    - `TokenService.cs`

- **Profile Updates**:
  - **Endpoint**: `/api/users/update`
  - **DTO**: `MemberUpdateDto`
  - **Logic**:
    - Validate user permissions.
    - Update user profile details.
  - **Related Files**:
    - `UsersController.cs`
    - `UserRepository.cs`

### **Like Feature**

- **Core Functionality**:
  - **Endpoint**: `/api/likes/{userId}`
  - **DTO**: `LikesParams`
  - **Logic**:
    - Allow users to like other users.
    - Support pagination for retrieving liked users.
  - **Related Files**:
    - `LikesController.cs`
    - `LikesRepository.cs`

### **Messaging**

- **Core Functionality**:
  - **Endpoint**: `/api/messages/`
  - **DTOs**: `CreateMessageDto`, `MessageDto`
  - **Logic**:
    - Enable users to send and receive messages.
    - Support pagination for message history.
  - **Related Files**:
    - `MessagesController.cs`
    - `MessageRepository.cs`

### **Photo Uploads**

- **Core Functionality**:
  - **Endpoint**: `/api/photos/`
  - **DTO**: `PhotoDto`
  - **Logic**:
    - Upload photos to Cloudinary and return the storage URL.
  - **Related Files**:
    - `PhotoService.cs`
    - `CloudinarySettings.cs`

### **Pagination and Querying**

- **Core Functionality**:
  - Utilize helper classes `PaginationParams` and `PagedList`.
  - Add pagination support to all list endpoints (e.g., likes, messages).
  - Include pagination metadata (`PaginationHeader`) in HTTP responses.

---

## **Database Design**

### **Tables**

Key entities in the database:

1. **Users (AppUser)**

   - **Primary Key**: `Id`
   - **Attributes**: `Username`, `PasswordHash`, `PasswordSalt`, `Email`, `Photos`

2. **Likes (UserLike)**

   - **Primary Key**: `SourceUserId`, `LikedUserId`
   - **Attributes**: `CreatedAt`

3. **Messages (Message)**

   - **Primary Key**: `Id`
   - **Attributes**: `SenderId`, `RecipientId`, `Content`, `DateRead`, `MessageSent`

4. **Photos (Photo)**
   - **Primary Key**: `Id`
   - **Attributes**: `Url`, `IsMain`, `PublicId`

---

## **Security Design**

### **Authentication**

- Implements JWT-based authentication.
- Stores passwords securely using hashing and salting.

### **Authorization**

- Enforces role-based access control (e.g., Admin roles for certain endpoints).
- Leverages claims and custom middleware for authorization.

---

## **Scalability and Extensibility**

### **Configuration and Environment Management**

- Application settings stored in `appsettings.json`.
- Environment-specific settings (e.g., development, production) managed via `appsettings.Development.json`.
- Sensitive information (e.g., database credentials, API keys) handled using environment variables.

### **Middleware Support**

- Custom middleware (`ExceptionMiddleware`) for global error handling.
- Easily extendable for additional middleware like rate-limiting or request logging.

### **Cloud Integration**

- Photo upload functionality uses Cloudinary, with the potential to switch to other services like AWS S3.

---

## **Deployment and Execution**

### **Local Development**

1. Install .NET SDK (8.0+).
2. Run the following commands:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
3. Access the API at `http://localhost:5000`.

### **Production Deployment**

1. Configure the production database connection.
2. Publish the application:
   ```bash
   dotnet publish -c Release -o out
   ```
3. Deploy the published output to a hosting environment (e.g., Docker, Azure, AWS).

---

## **Attachments**

### **Migration Commands**

- Add a migration:
  ```bash
  dotnet ef migrations add MigrationName
  ```
- Update the database:
  ```bash
  dotnet ef database update
  ```

### **API Testing Tools**

- Recommended tools: Postman, Swagger.

---

This design document outlines the project's architecture, features, and deployment strategies, serving as a comprehensive guide for developers and stakeholders. Let me know if additional details are needed!
