using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using HealthSocialMediaApp.Controllers;
using HealthSocialMediaApp.Data;
using HealthSocialMediaApp.Models;
using HealthSocialMediaUnitTest.Utilities;
using Moq;
using Xunit;

namespace HealthSocialMediaUnitTest
{
    public class PostsControllerTests
    {
        #region setup
        private int postId = 1;
        public Post CreateDummyPost(string userId, int categoryId)
        {
            var user = CreateDummyUser(userId);
            postId += 1;
            return new Post
            {
                Id = postId,
                ApplicationUserId = user.Id,
                CategoryId = categoryId,
                Description = "My new shoes",
                ImageLink = "../images/example.jpg"
            };
        }

        private ApplicationUser CreateDummyUser(string id)
        {
            return new ApplicationUser
            {
                Email = "Jimmy@mail.com",
                UserName = "Jimmy",
                Description = "My fitness account",
                Id = id
            };
        }

        private Category CreateDummyCategory(int id)
        {
            return new Category { Id = id, Name = "General" };
        }

        private PostsController CreatePostsController(ApplicationDbContext dbContext, string currentUserId)
        {
            var hostingEnvironment = Mock.Of<IWebHostEnvironment>(e => e.ApplicationName == "application");
            hostingEnvironment.WebRootPath = "../";

            var postsController = new PostsController(dbContext, hostingEnvironment);

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

        #endregion

        [Fact]
        public async void PostsInCorrectOrder()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostsTestDbPostsInCorrectOrder");
            string authenticatedUserId = "current-user-id";
            var user = CreateDummyUser(authenticatedUserId);
            var category = CreateDummyCategory(1);
            context.Users.Add(user);
            context.Categories.Add(category);
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            var postOld = CreateDummyPost(user.Id, category.Id);
            var postNew = CreateDummyPost(user.Id, category.Id);
            await postsController.PostPost(postOld);
            await postsController.PostPost(postNew);

            var response = await postsController.GetPosts(null, null, null);
            var listIds = new List<Nullable<int>>();
            foreach (var post in response.Value)
            {
                var dictionary = new RouteValueDictionary(post);
                listIds.Add(dictionary["Id"] as Nullable<int>);
            }

            Assert.Equal(postNew.Id, listIds.First());
        }

        [Fact]
        public async void CanGetPostById()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostsTestDbGetPostById");
            string authenticatedUserId = "current-user-id";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost(authenticatedUserId, category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            var response = await postsController.GetPost(post.Id);

            Assert.Equal(post, response.Value);
        }

        [Fact]
        public async void CantGetNonExistingPostById()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostsTestDbGetNonExistingPostById");
            string authenticatedUserId = "current-user-id";
            var postsController = CreatePostsController(context, authenticatedUserId);

            var response = await postsController.GetPost(2);

            Assert.IsAssignableFrom<NotFoundResult>(response.Result);
        }

        [Fact]
        public async void CanLikeAndUnlikeAPost()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("CanLikeAndUnlikeAPost");
            string authenticatedUserId = "current-user-id";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost(authenticatedUserId, category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            var initialLikeCount = (from like in context.Likes where like.PostId == post.Id select like.Id).Count();
            Assert.Equal(0, initialLikeCount);

            await postsController.PutPostLike(post.Id, post.ApplicationUserId);

            var likeCountAfterLike = (from like in context.Likes where like.PostId == post.Id select like.Id).Count();

            Assert.Equal(1, likeCountAfterLike);

            await postsController.PutPostUnlike(post.Id, post.ApplicationUserId);

            var likeCountAfterUnlike = (from like in context.Likes where like.PostId == post.Id select like.Id).Count();
            Assert.Equal(0, initialLikeCount);
        }

        [Fact]
        public async void CantLikeANonExistingPost()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostsTestDbLikeANonExistingPost");
            string authenticatedUserId = "current-user-id";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost(authenticatedUserId, category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            await context.SaveChangesAsync();
            var postsController = CreatePostsController(context, authenticatedUserId);

            int nonExistingPostId = 111;
            var response = await postsController.PutPostLike(nonExistingPostId, post.ApplicationUserId);

            Assert.IsAssignableFrom<BadRequestResult>(response.Result);
        }

        [Fact]
        public async void CantUnLikeANonExistingPost()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostsTestDbUnLikeANonExistingPost");
            string authenticatedUserId = "current-user-id";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost(authenticatedUserId, category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            await context.SaveChangesAsync();
            var postsController = CreatePostsController(context, authenticatedUserId);

            int nonExistingPostId = 111;
            var response = await postsController.PutPostUnlike(nonExistingPostId, post.ApplicationUserId);

            Assert.IsAssignableFrom<BadRequestResult>(response.Result);
        }

        [Fact]
        public async void CantUnLikeAPostThatIsNotLiked()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostsTestDbUnLikeAPostThatIsNotLiked");
            string authenticatedUserId = "current-user-id";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost(authenticatedUserId, category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            await postsController.PutPostUnlike(post.Id, post.ApplicationUserId);

            var likeCount = (from like in context.Likes where like.PostId == 111 select like.Id).Count();

            Assert.Equal(0, likeCount);
        }

        [Fact]
        public async void CantLikeALikedPost()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostsTestDbUserAlreadyLikedPost");
            string authenticatedUserId = "current-user-id";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost(authenticatedUserId, category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            context.Likes.Add(new Like { ApplicationUserId = post.ApplicationUserId, PostId = post.Id });
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            var response = await postsController.PutPostLike(post.Id, post.ApplicationUserId);

            Assert.IsAssignableFrom<BadRequestResult>(response.Result);
        }

        [Fact]
        public async void CanDeletePostOwnedByUser()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("postControllerTestCanDeletePost");
            string authenticatedUserId = "current-user-id";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost(authenticatedUserId, category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            Assert.True(context.Posts.Any(e => e.Id == post.Id));

            await postsController.DeletePost(post.Id);

            Assert.False(context.Posts.Any(e => e.Id == post.Id));
        }

        [Fact]
        public async void DeletingNonExistingPostsIsHandled()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("DeletingNonExistingPostsIsHandled");
            string authenticatedUserId = "current-user-id";
            var postsController = CreatePostsController(context, authenticatedUserId);

            int idToDelete = 4;

            Assert.False(context.Posts.Any(e => e.Id == idToDelete));
            var response = await postsController.DeletePost(idToDelete);

            Assert.IsAssignableFrom<NotFoundResult>(response.Result);
        }

        [Fact]
        public async void CanNotDeletePostOwnedByOtherUser()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostControllerTestCanNotDeletePostOwnerByOtherUser");
            string authenticatedUserId = "hackerman";
            var category = CreateDummyCategory(1);
            var post = CreateDummyPost("another-user", category.Id);
            context.Categories.Add(category);
            context.Posts.Add(post);
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            Assert.True(context.Posts.Any(e => e.Id == post.Id));

            var response = await postsController.DeletePost(post.Id);

            Assert.True(context.Posts.Any(e => e.Id == post.Id));
            Assert.IsAssignableFrom<ForbidResult>(response.Result);
        }

        [Fact]
        public async void CanNotCreatePostAsOtherUser()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("PostControllerTestCanNotCreatePostAsOtherUser");
            string authenticatedUserId = "hackerman";
            var category = CreateDummyCategory(1);
            context.Categories.Add(category);
            await context.SaveChangesAsync();

            var postsController = CreatePostsController(context, authenticatedUserId);

            var response = await postsController.PostPost(CreateDummyPost("another-user", 1));

            Assert.True(context.Posts.Count() == 0);
            Assert.IsAssignableFrom<ForbidResult>(response.Result);
        }
    }
}
