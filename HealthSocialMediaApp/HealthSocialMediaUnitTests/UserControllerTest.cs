using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using System;
using System.Linq;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Options;
using HealthSocialMediaApp.Controllers;
using Microsoft.AspNetCore.Routing;

namespace HealthSocialMediaUnitTest
{
    public class UserControllerTest
    {
        private ApplicationDbContext SetUpDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "UserTestDB")
                .Options;

            var operationalStoreOptions = Options.Create(
                new OperationalStoreOptions
                {
                    DeviceFlowCodes = new TableConfiguration("DeviceCodes"),
                    PersistedGrants = new TableConfiguration("PersistedGrants")
                });

            return new ApplicationDbContext(options, operationalStoreOptions);
        }

        [Fact]
        public async void UserIsUpdated()
        {
            // Arrange
            #region context preperation
            var context = SetUpDbContext();
            #endregion

            #region data preperation

            string userId = "one-two-three";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "Jimmy",
                Email = "Jimmy@mail.com",
                Description = "My fitness account",
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            string updatedUserName = "Slippin Jimmy";
            string updatedDescription = "Need a will? Call McGill.";
            var updatedUser = new ApplicationUser
            {
                Id = userId,
                UserName = updatedUserName,
                Description = updatedDescription,
            };

            #endregion

            // Act
            ApplicationUsersController usersController = new ApplicationUsersController(context);
            var result = await usersController.PutApplicationUser(updatedUser);

            // Assert
            var storedData = await context.Users.SingleAsync(u => u.Id == userId);
            Assert.Equal(updatedUserName, storedData.UserName);
            Assert.Equal(updatedDescription, storedData.Description);

            var actualUser = await usersController.GetUser(userId);
            Assert.NotNull(actualUser);
        }
    }
}
