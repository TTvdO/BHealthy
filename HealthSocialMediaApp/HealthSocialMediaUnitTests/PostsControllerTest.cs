using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Options;
using System;
using System.Linq;
using HealthSocialMediaApp.Controllers;
using System.Collections.Generic;
using Microsoft.AspNetCore.Routing;

namespace HealthSocialMediaUnitTest
{
    public class PostsControllerTests
    {

        public ApplicationDbContext CreateContextTests(string name)
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

        private ApplicationUser CreateDummyUser(string id, ApplicationDbContext _context)
        {
            var appUser = new ApplicationUser
            {
                Email = "Jimmy@mail.com",
                UserName = "Jimmy",
                Description = "My fitness account",
                Id = id
            };

            _context.Users.Add(appUser);
            _context.SaveChanges();

            return appUser;
        }

        private Category CreateDummyCategory(int id, ApplicationDbContext _context)
        {
            var category = new Category { Id = id, Name = "General" };
            _context.Categories.Add(category);
            _context.SaveChanges();
            return category;
        }

        [Fact]
        public void PostExists()
        {
            ApplicationDbContext _context = CreateContextTests("tesDb1");
            var user = CreateDummyUser("sdfaf sdf", _context);
            var category = CreateDummyCategory(12, _context);
            var description = "My new shoes";
            var imageLink = "../images/example.jpg";
            DateTime createdAt = new DateTime(2019, 3, 25);

            var post = new Post
            {
                Id = 12,
                ApplicationUserId = user.Id,
                CategoryId = category.Id,
                Description = description,
                ImageLink = imageLink,
                CreatedAt = createdAt
            };

            _context.Posts.Add(post);
            _context.SaveChanges();

            Assert.True(_context.Posts.Any(e => e.Id == post.Id));
        }

        [Fact]
        public async void PostsInCorrectOrder()
        {
            ApplicationDbContext _context = CreateContextTests("testDb2");
            var user = CreateDummyUser("sdfaf sdf", _context);
            var category = CreateDummyCategory(12, _context);
            var description = "My new shoes";
            var imageLink = "../images/example.jpg";

            var postOld = new Post
            {
                Id = 14,
                ApplicationUserId = user.Id,
                CategoryId = category.Id,
                Description = description,
                ImageLink = imageLink
            };
            var postNew = new Post
            {
                Id = 15,
                ApplicationUserId = user.Id,
                CategoryId = category.Id,
                Description = description,
                ImageLink = imageLink
            };

            //act
            PostsController postsController = new PostsController(_context, null);
            await postsController.PostPost(postOld);
            await postsController.PostPost(postNew);

            postNew = _context.Posts.Where(p => p.Id == 15).FirstOrDefault();
            postNew.CreatedAt = postNew.CreatedAt.AddSeconds(1);
            _context.Posts.Update(postNew);
            _context.SaveChanges();

            //assert
            var posts = await postsController.GetPosts(null, null, null);
            List<Nullable<int>> listIds = new List<Nullable<int>>();
            foreach (var post in posts.Value)
            {
                //code to get parameter of an anonymous object (System.Collections.Generic in Controller made it hard to get specific attribute of the object found).
                //see https://stackoverflow.com/a/14877416 + https://docs.microsoft.com/en-us/dotnet/api/system.web.routing.routevaluedictionary?view=netframework-4.8
                var dictionary = new RouteValueDictionary(post);
                listIds.Add(dictionary["Id"] as Nullable<int>);
            }

            Assert.Equal(15, listIds.First());
        }
    }
}
