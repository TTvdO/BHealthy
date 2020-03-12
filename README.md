# BHealthy Social Medium

[![Build status](https://dev.azure.com/hhs-se-s6/Group%204/_apis/build/status/BHealthy.CI)](https://dev.azure.com/hhs-se-s6/Group%204/_build/latest?definitionId=6)

## Introduction

BHealthy aims to improve the lives of health enthusiasts.

## Getting Started

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

### 3. Initialize to a local development database

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

Install NPM packages for the Single Page Application frontend.

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

TODO: Describe and show how to build your code and run the tests.
