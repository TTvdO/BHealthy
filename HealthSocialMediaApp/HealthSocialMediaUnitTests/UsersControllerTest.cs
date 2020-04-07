using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using Microsoft.EntityFrameworkCore;
using HealthSocialMediaApp.Controllers;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Routing;

namespace HealthSocialMediaUnitTest
{
    public class UserControllerTest
    {
        [Fact]
        public async void UserIsUpdated()
        {
            // Arrange
            #region context preperation
            var context = DbContextCreator.CreateTestContext("UsersTestDbUserIsUpdated");
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
            UsersController usersController = new UsersController(context);
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
            var context = DbContextCreator.CreateTestContext("UsersTestDbPutFollow");
            #endregion

            #region data preperation

            ApplicationUser user1 = PutOneUserInDb(context, "first", "john");
            ApplicationUser user2 = PutOneUserInDb(context, "second", "oh Hi mark");
            #endregion

            //Act
            UsersController usersController = new UsersController(context);
            await usersController.PutFollow(user1.Id, user2.Id);

            //Assert
            Assert.True(context.Followers.Any(f => f.FollowerId == user1.Id && f.FolloweeId == user2.Id));

        }

        [Fact]
        public async void PutUnFollow()
        {
            // Arrange
            #region context preperation
            var context = DbContextCreator.CreateTestContext("UsersTestDbPutUnfollow");
            #endregion

            #region data preperation

            ApplicationUser user1 = PutOneUserInDb(context, "first", "john");
            ApplicationUser user2 = PutOneUserInDb(context, "second", "oh Hi mark");
            context.Followers.Add(new FollowerFollowee { FolloweeId = user2.Id, FollowerId = user1.Id });
            context.SaveChanges();
            #endregion

            //Act
            UsersController usersController = new UsersController(context);
            await usersController.PutUnFollow(user1.Id, user2.Id);

            //Assert
            Assert.False(context.Followers.Any(f => f.FollowerId == user1.Id && f.FolloweeId == user2.Id));
        }

        [Fact]
        public async void GetAllFollows()
        {
            // Arrange
            #region context preperation
            var context = DbContextCreator.CreateTestContext("UsersTestDbGetAllFollows");
            #endregion

            #region data preperation

            ApplicationUser user1 = PutOneUserInDb(context, "first", "john");
            ApplicationUser user2 = PutOneUserInDb(context, "second", "oh Hi mark");
            context.Followers.Add(new FollowerFollowee { FolloweeId = user2.Id, FollowerId = user1.Id });
            context.SaveChanges();
            #endregion

            //Act
            UsersController usersController = new UsersController(context);
            var users = await usersController.GetAllFollows(user1.Id);

            //Assert
            List<string> listIds = new List<string>();
            foreach (var user in users.Value)
            {
                var dictionary = new RouteValueDictionary(user);
                listIds.Add(dictionary["Id"] as string);
            }

            Assert.Equal(user2.Id, listIds.First());
            Assert.Single(listIds);
        }

        [Fact]
        public async void GetAllFollowers()
        {
            // Arrange
            #region context preperation
            var context = DbContextCreator.CreateTestContext("UsersTestDbGetAllFollowers");
            #endregion

            #region data preperation

            ApplicationUser user1 = PutOneUserInDb(context, "first", "john");
            ApplicationUser user2 = PutOneUserInDb(context, "second", "oh Hi mark");
            context.Followers.Add(new FollowerFollowee { FolloweeId = user2.Id, FollowerId = user1.Id });
            context.SaveChanges();
            #endregion

            //Act
            UsersController usersController = new UsersController(context);
            var users = await usersController.GetAllFollowers(user2.Id);

            //Assert
            List<string> listIds = new List<string>();
            foreach (var user in users.Value)
            {
                var dictionary = new RouteValueDictionary(user);
                listIds.Add(dictionary["Id"] as string);
            }

            Assert.Equal(user1.Id, listIds.First());
            Assert.Single(listIds);
        }

        private ApplicationUser PutOneUserInDb(
            ApplicationDbContext _context,
            string userId = "one-two-three",
            string userName = "Jimmy")
        {

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
