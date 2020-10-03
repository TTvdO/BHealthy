# BHealthy

## Introduction

BHealthy is a social medium application that aims to improve the lives of health enthusiasts.

## Installation process

### 1. Clone the repository

Over http

```bash
git clone https://hhs-se-s6@dev.azure.com/hhs-se-s6/Group%204/_git/Group%204
```

Over ssh

```bash
git clone git@ssh.dev.azure.com:v3/hhs-se-s6/Group%204/Group%204
```

### 2. Initialize user secrets.

Used for the Google Authentication API. Replace CLIENT_ID and CLIENT_SECRET with the development API key's for Google Authentication.

```bash
dotnet user-secrets init
dotnet user-secrets set "Authentication:Google:ClientId" "CLIENT_ID"
dotnet user-secrets set "Authentication:Google:ClientSecret" "CLIENT_SECRET"
```

### 3. Initialize a development database

Run this command in the same directory where in HealthSocialMediaApp.csproj is located to set up a connection to your local database server with the connection string.

```bash
echo '{"ConnectionStrings": {"DefaultConnection": "Server=localhost;Database=BHealthy;User Id=;Password="}}' >localsettings.json
```

Install entity framework and create the database.

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update
```

### 4. Install dependencies

Restore NuGet packages.

```bash
dotnet restore
```

Install NPM packages for the Single Page Application frontend built with React.

```bash
cd ClientApp
npm install
```

### 5. Run the application

Run while watching for file changes.

```
dotnet watch run
```

## Build and Test

The directory HealthSocialMediaApp contains two directories:

- HealthSocialMediaApp, containing the application. Run with `dotnet run` or build with `dotnet build`.
- HealthSocialMediaUnitTests, containing unit tests. Run with `dotnet test`.

## Azure pipeline and resources

The file 'azure-pipelines.yml' contains the necessary CI steps that are required to build the application in Azure. Besides this, the 'deployment' directory contains the ARM templates for deploying to Azure.
