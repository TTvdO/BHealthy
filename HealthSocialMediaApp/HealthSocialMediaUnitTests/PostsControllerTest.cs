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
using Moq;
using Microsoft.AspNetCore.Hosting;

namespace HealthSocialMediaUnitTest
{
    public class PostsControllerTests
    {
		#region setup
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

        public Post CreateDummyData(ApplicationDbContext _context) {
            var user = CreateDummyUser("Person", _context);
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
            return post;
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
		#endregion

		[Fact]
        public void PostExists()
        {
            ApplicationDbContext _context = CreateContextTests("tesDb1");
            var post = CreateDummyData(_context);
            
            Assert.True(_context.Posts.Any(e => e.Id == post.Id));
        }

        [Fact]
        public async void PostsInCorrectOrder()
        {
            ApplicationDbContext _context = CreateContextTests("testDb2");
            var user = CreateDummyUser("Danny", _context);
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
                var dictionary = new RouteValueDictionary(post);
                listIds.Add(dictionary["Id"] as Nullable<int>);
            }

            Assert.Equal(15, listIds.First());
        }

        [Fact]
        public async void GetPostById()
        {
            ApplicationDbContext _context = CreateContextTests("tesDb3");
            var Expected = CreateDummyData(_context);
            PostsController postsController = new PostsController(_context, null);

            var Result = await postsController.GetPost(Expected.Id);

            Assert.Equal(Expected,Result.Value);
        }

        [Fact]
        public async void LikeAPost()
        {
            ApplicationDbContext _context = CreateContextTests("tesDb4");
            var post = CreateDummyData(_context);
            PostsController postsController = new PostsController(_context, null);

            await postsController.PutPostLike(post.Id,post.ApplicationUserId);

            var likeCount = (from like in _context.Likes where like.PostId == post.Id select like.Id).Count();

            Assert.Equal(1,likeCount);
        }

        [Fact]
        public async void UnLikeAPost()
        {
            ApplicationDbContext _context = CreateContextTests("tesDb5");
            var post = CreateDummyData(_context);
            PostsController postsController = new PostsController(_context, null);
            _context.Likes.Add(new Like { ApplicationUserId = post.ApplicationUserId, PostId = post.Id });

            await postsController.PutPostUnlike(post.Id, post.ApplicationUserId);

            var likeCount = (from like in _context.Likes where like.PostId == post.Id select like.Id).Count();

            Assert.Equal(0, likeCount);
        }

        [Fact]
        public async void DeletePost()
        {
            ApplicationDbContext _context = CreateContextTests("tesDb6");
            var post = CreateDummyData(_context);
            var hostingEnvironment = Mock.Of<IWebHostEnvironment>(e => e.ApplicationName == "application");
            hostingEnvironment.WebRootPath = "../";
            PostsController postsController = new PostsController(_context, hostingEnvironment);
            
            await postsController.DeletePost(post.Id);

            Assert.False(_context.Posts.Any(e => e.Id == post.Id));
        }
    }
}
