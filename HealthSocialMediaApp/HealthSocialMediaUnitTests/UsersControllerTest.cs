using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using HealthSocialMediaApp.Controllers;
using HealthSocialMediaApp.Data;
using HealthSocialMediaApp.Models;
using HealthSocialMediaUnitTest.Utilities;
using Xunit;

namespace HealthSocialMediaUnitTest
{
    public class UserControllerTest
    {
        private UsersController CreateUsersController(ApplicationDbContext dbContext, string currentUserId)
        {
            var postsController = new UsersController(dbContext);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, currentUserId),
            }, "mock"));

            postsController.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            return postsController;
        }

        [Fact]
        public async void UserIsUpdated()
        {
            // Arrange
            #region context preperation
            var context = DbContextCreator.CreateTestContext("UsersTestDbUserIsUpdated");
            #endregion

            #region data preperation
            ApplicationUser user = PutOneUserInDb(context);
            var updatedUser = new ApplicationUser
            {
                Id = user.Id,
                UserName = "Slippin Jimmy",
                Description = "Need a will? Call McGill.",
            };

            #endregion

            // Act
            UsersController usersController = CreateUsersController(context, updatedUser.Id);
            var result = await usersController.PutApplicationUser(updatedUser);

            // Assert
            var storedData = await context.Users.SingleAsync(u => u.Id == user.Id);
            Assert.Equal(updatedUser.UserName, storedData.UserName);
            Assert.Equal(updatedUser.Description, storedData.Description);

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

            ApplicationUser follower = PutOneUserInDb(context, "first", "john");
            ApplicationUser followee = PutOneUserInDb(context, "second", "oh Hi mark");
            #endregion

            //Act
            UsersController usersController = CreateUsersController(context, follower.Id);
            await usersController.PutFollow(follower.Id, followee.Id);

            //Assert
            Assert.True(context.Followers.Any(f => f.FollowerId == follower.Id && f.FolloweeId == followee.Id));

        }

        [Fact]
        public async void PutUnFollow()
        {
            // Arrange
            #region context preperation
            var context = DbContextCreator.CreateTestContext("UsersTestDbPutUnfollow");
            #endregion

            #region data preperation

            ApplicationUser follower = PutOneUserInDb(context, "first", "john");
            ApplicationUser followee = PutOneUserInDb(context, "second", "oh Hi mark");
            context.Followers.Add(new FollowerFollowee { FolloweeId = followee.Id, FollowerId = follower.Id });
            context.SaveChanges();
            #endregion

            //Act
            UsersController usersController = CreateUsersController(context, follower.Id);
            await usersController.PutUnFollow(follower.Id, followee.Id);

            //Assert
            Assert.False(context.Followers.Any(f => f.FollowerId == follower.Id && f.FolloweeId == followee.Id));
        }

        [Fact]
        public async void GetAllFollows()
        {
            // Arrange
            #region context preperation
            var context = DbContextCreator.CreateTestContext("UsersTestDbGetAllFollows");
            #endregion

            #region data preperation

            ApplicationUser follower = PutOneUserInDb(context, "first", "john");
            ApplicationUser followee = PutOneUserInDb(context, "second", "oh Hi mark");
            context.Followers.Add(new FollowerFollowee { FolloweeId = followee.Id, FollowerId = follower.Id });
            context.SaveChanges();
            #endregion

            //Act
            UsersController usersController = CreateUsersController(context, follower.Id);
            var users = await usersController.GetAllFollows(follower.Id);

            //Assert
            List<string> listIds = new List<string>();
            foreach (var user in users.Value)
            {
                var dictionary = new RouteValueDictionary(user);
                listIds.Add(dictionary["Id"] as string);
            }

            Assert.Equal(followee.Id, listIds.First());
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

            ApplicationUser follower = PutOneUserInDb(context, "first", "john");
            ApplicationUser followee = PutOneUserInDb(context, "second", "oh Hi mark");
            context.Followers.Add(new FollowerFollowee { FolloweeId = followee.Id, FollowerId = follower.Id });
            context.SaveChanges();
            #endregion

            //Act
            UsersController usersController = CreateUsersController(context, follower.Id);
            var users = await usersController.GetAllFollowers(followee.Id);

            //Assert
            List<string> listIds = new List<string>();
            foreach (var user in users.Value)
            {
                var dictionary = new RouteValueDictionary(user);
                listIds.Add(dictionary["Id"] as string);
            }

            Assert.Equal(follower.Id, listIds.First());
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
