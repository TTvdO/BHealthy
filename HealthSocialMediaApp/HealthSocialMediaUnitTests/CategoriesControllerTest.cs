using HealthSocialMediaApp.Controllers;
using HealthSocialMediaApp.Data;
using HealthSocialMediaApp.Models;
using Microsoft.AspNetCore.Routing;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace HealthSocialMediaUnitTest
{
    public class CategoriesControllerTest
    {
        [Fact]
        public async void GetCategories()
        {
            ApplicationDbContext context = DbContextCreator.CreateTestContext("CategoriesTestDb");
            CategoriesController c = new CategoriesController(context);

            context.Categories.Add(new Category { Name = "food" });
            context.SaveChanges();

            var result = await c.GetCategories();
            List<string> listIds = new List<string>();
            foreach (var category in result.Value)
            {
                var dictionary = new RouteValueDictionary(category);
                listIds.Add(dictionary["Name"] as string);
            }

            Assert.Equal("food", listIds.First());
        }
    }
}
