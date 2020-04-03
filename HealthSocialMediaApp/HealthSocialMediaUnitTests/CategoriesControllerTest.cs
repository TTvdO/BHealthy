using HealthSocialMediaApp.Controllers;
using HealthSocialMediaApp.Data;
using HealthSocialMediaApp.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace HealthSocialMediaUnitTest
{
	public class CategoriesControllerTest
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

        [Fact]
        public async void GetCategories()
        {
            ApplicationDbContext _context = CreateContextTests("tesDb6");
            CategoriesController c = new CategoriesController(_context);

            _context.Categories.Add(new Category { Name="food"} );
            _context.SaveChanges();

            var result = await c.GetCategories();
            List<string> listIds = new List<string>();
            foreach (var category in result.Value)
            {
                var dictionary = new RouteValueDictionary(category);
                listIds.Add(dictionary["Name"] as string);
            }
            
            Assert.Equal("food",listIds.First());
        }
    }
}
