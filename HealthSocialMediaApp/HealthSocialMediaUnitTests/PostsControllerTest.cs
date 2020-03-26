using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Options;
using System;
using System.Linq;


namespace HealthSocialMediaUnitTest
{
    public class PostsControllerTests
    {
        private ApplicationDbContext _context;

        public PostsControllerTests()
        {

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB")
                .Options;

            var operationalStoreOptions = Options.Create(
                new OperationalStoreOptions
                {
                    DeviceFlowCodes = new TableConfiguration("DeviceCodes"),
                    PersistedGrants = new TableConfiguration("PersistedGrants")
                });

            _context = new ApplicationDbContext(options, operationalStoreOptions);
        }

        private ApplicationUser CreateDummyUser(string id)
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

        private Category CreateDummyCategory(int id)
        {
            var category = new Category{ Id = id, Name = "General"};
            _context.Categories.Add(category);
            _context.SaveChanges();
            return category;
        }

        [Fact]
        public void PostExists()
        {
            var user = CreateDummyUser("sdfaf sdf");
            var category = CreateDummyCategory(12);
            var description = "My new shoes";
            var imageLink = "../images/example.jpg";
            DateTime createdAt = new DateTime(2020, 3, 25);

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
    }
}
