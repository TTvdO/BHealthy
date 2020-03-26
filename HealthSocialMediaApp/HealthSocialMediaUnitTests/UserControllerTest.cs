using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Options;
using HealthSocialMediaApp.Controllers;

namespace HealthSocialMediaUnitTest
{
    public class UserControllerTest
    {
        private ApplicationDbContext _context;


        public UserControllerTest()
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

        //Write unit test to verify that user data can be accessed with GET
        [Fact]
        public void UserExists()
        {
            string email = "Jimmy@mail.com";
            string username = "Jimmy";
            string description = "My fitness account";
            string id = "ojsadkhfaskjdfh";

            var appUser = new ApplicationUser
            {
                Email = email,
                UserName = username,
                Description = description,
                Id = id
            };

            _context.Users.Add(appUser);
            _context.SaveChanges();

            //act
            ApplicationUsersController applicationUsersController = new ApplicationUsersController(_context);
            var result = applicationUsersController.GetUser(id);

            // Assert
            Assert.Equal(email, result.Result.Value.Email);
            Assert.Equal(username, result.Result.Value.UserName);
            Assert.Equal(description, result.Result.Value.Description);
        }

        //Write unit test to verify that user data can be stored with PUT
        [Fact]
        public async void UserIsStored()
        {
            string email = "Jimmy@mail.com";
            string id = "one-two-three";

            var appUser = new ApplicationUser
            {
                Email = "Jimmy@mail.com",
                UserName = "Jimmy",
                Description = "My fitness account",
                Id = id
            };

            //act
            ApplicationUsersController applicationUsersController = new ApplicationUsersController(_context);
            await applicationUsersController.PutApplicationUser(id, appUser);

            // Assert
            Assert.Equal(email, _context.Users.Find(id).Email);
        }
    }
}
