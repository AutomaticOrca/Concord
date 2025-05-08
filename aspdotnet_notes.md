docker compose up -d

dotnet ef database drop
drop sqlite

dotnet ef migrations add SqlInitial -o Data/Migrations

dotnet publish -c Release -o ./bin/Publish
