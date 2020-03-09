using System;
using Xunit;
using HealthSocialMediaApp.Models;

namespace HealthSocialMediaUnitTest
{
    public class PostsControllerTests
    {
        [Fact]
        public void PostExists()
        {
            // Set up
            var post = new Post();

            // Assert
            Assert.NotNull(post);
        }
    }
}
