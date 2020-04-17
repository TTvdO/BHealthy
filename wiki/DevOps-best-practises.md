# DevOps practises

This application is developed with DevOps best practices. This section gives an overview of the practices used in this project.

## Plan

### MVP
Every sprint we aimed to deliver a working application. That's why we decided to first focus on the "skateboard" version of our application, the MVP. We discussed what was absolutely necessary with the product owners. We then built a skateboard: an application where you can log in and create posts. Later we expanded this with more functionality while aiming to create functionality that is fully usable. 

## Code

### Branching

We created [a source control guide](https://dev.azure.com/hhs-se-s6/Group%204/_wiki/wikis/Group-4.wiki/5/Source-Control-Guide) we would use to keep branching work smoothly. This guide contains agreements on commit names, branch names and our merging strategy.

### Pull Requests/Code reviews

Each product backlog item (PBI) or task, depending on the size, gets a feature branch. When the code for the feature is developed, the developer opens a pull request (PR). A pull request can be completed when the following conditions apply:
- The CI pipeline succeeds
- The PR is reviewed and approved by at least one other developer
- The PR has a linked PBI
- Any comments are resolved

### What we put in
Besides application code, we put in ARM templates. Our CI pipeline is written as code as well (in yaml format).

### Pair programming
We utilized pair programming, which we reported on earlier this school block.

## Build

### Continuous Integration (CI)
Our continuous integration pipeline, named BHealthy.CI, is kept in our repository as code. Besides building and testing, this pipeline also runs a SonarQube and ESLint analysis. This analysis gives feedback to the developer for improvements. When a test or ESLint analysis fails, the pipeline fails as well, signaling the developers that improvement is necessary.

### Static Analysis

SonarQube is used for finding technical debt. Please refer to [our dashboard](https://hhssonarqube.westeurope.cloudapp.azure.com/).

ESLint is used to lint JavaScript. Rules are configured according to React best practices.

### Package Management
We use NuGet for our server code, and NPM for our clientside code. 

## Test 

### Unit testing
xUnit are run automatically in the CI pipeline. We have tests for the controllers of the application's server code. We use a fake, in memory database to test when a database context is necessary.

### Manual Testing 
Test cases are written and used for manual testing. Group 5 tested our application using the test cases, which resulted in reported bugs and feedback. This feedback was used to create new PBI's.

### Smoke tests
Smoke tests verify that the application is running in our test and production environments.

## Deploy

### Continuous Delivery and Deployment (CD)
When the CI pipeline produces artifacts, the release pipeline is triggered. This pipeline contains two stages in which the artifacts/binaries can be promoted: testing and production. Both stages do three things in order:

1. Create or update Azure resources. From the ARM templates in the main repository, all resources in Azure are created and updated automatically. We have our infrastructure as code.
2. Publish the site to Azure. The built application is published.
3. Run smoke tests. It is verified that the application is up and running.

The testing stage is entered automatically. If this succeeds, the production stage can be entered if a developer to approves of this.

## Release
### Feature toggles
We implemented feature toggles for image upload functionality in both the server and client code so we could do a dark release while the functionality was not completed yet. We used LaunchDarkly for this. 

## Operate and Monitor

### Application Insights
We configured Application Insights for our application. This is viewable in the Azure Portal.

