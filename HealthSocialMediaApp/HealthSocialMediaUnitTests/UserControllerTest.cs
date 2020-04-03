using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Options;
using HealthSocialMediaApp.Controllers;
using System.Linq;

namespace HealthSocialMediaUnitTest
{
    public class UserControllerTest
    {
        private ApplicationDbContext SetUpDbContext(string name)
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: name)
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
            var context = SetUpDbContext("testDb1");
            #endregion

            #region data preperation
            ApplicationUser user = PutOneUserInDb(context);
            string updatedUserName = "Slippin Jimmy";
            string updatedDescription = "Need a will? Call McGill.";
            var updatedUser = new ApplicationUser
            {
                Id = user.Id,
                UserName = updatedUserName,
                Description = updatedDescription,
            };

            #endregion

            // Act
            ApplicationUsersController usersController = new ApplicationUsersController(context);
            var result = await usersController.PutApplicationUser(updatedUser);

            // Assert
            var storedData = await context.Users.SingleAsync(u => u.Id == user.Id);
            Assert.Equal(updatedUserName, storedData.UserName);
            Assert.Equal(updatedDescription, storedData.Description);

            var actualUser = await usersController.GetUser(user.Id);
            Assert.NotNull(actualUser);
        }

        [Fact]
        public async void PutFollow()
        {
            // Arrange
            #region context preperation
            var context = SetUpDbContext("testDb3");
            #endregion

            #region data preperation

            ApplicationUser user1 = PutOneUserInDb(context, "first","john");
            ApplicationUser user2 = PutOneUserInDb(context, "second","oh Hi mark");
            #endregion

            //Act
            ApplicationUsersController usersController = new ApplicationUsersController(context);
            await usersController.PutFollow(user1.Id, user2.UserName);

            //Assert
            Assert.True(context.Followers.Any(f=>f.FollowerId ==user1.Id && f.FolloweeId == user2.Id));

        }

        [Fact]
        public async void PutUnFollow()
        {
            // Arrange
            #region context preperation
            var context = SetUpDbContext("testDb4");
            #endregion

            #region data preperation

            ApplicationUser user1 = PutOneUserInDb(context, "first", "john");
            ApplicationUser user2 = PutOneUserInDb(context, "second", "oh Hi mark");
            context.Followers.Add(new FollowerFollowee { FolloweeId = user2.Id, FollowerId = user1.Id });
            context.SaveChanges();
            #endregion

            //Act
            ApplicationUsersController usersController = new ApplicationUsersController(context);
            await usersController.PutUnFollow(user1.Id, user2.UserName);

            //Assert
            Assert.False(context.Followers.Any(f => f.FollowerId == user1.Id && f.FolloweeId == user2.Id));
        }

        private ApplicationUser PutOneUserInDb(
            ApplicationDbContext _context, 
            string userId ="one-two-three",
            string userName = "Jimmy") {

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = userName,
                Email = "Jimmy@mail.com",
                Description = "My fitness account",
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

    }
}
