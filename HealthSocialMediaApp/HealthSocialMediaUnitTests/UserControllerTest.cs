using System;
using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using Moq;
using System.Linq;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using HealthSocialMediaApp.Controllers;

namespace HealthSocialMediaUnitTest
{
	public class UserControllerTest
	{
		//Write unit test to verify that user data can be accessed with GET
		[Fact]
		public void UserExists()
		{
			//arrange
			#region context preperation

			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: "TestDB")
				.Options;

			var operationalStoreOptions = Options.Create(
				new OperationalStoreOptions
				{
					DeviceFlowCodes = new TableConfiguration("DeviceCodes"),
					PersistedGrants = new TableConfiguration("PersistedGrants")
				});
			var context = new ApplicationDbContext(options, operationalStoreOptions);
			#endregion

			#region data preperation

			string email = "Jimmy@mail.com";
			string id = "one-two";

			var appUser = new ApplicationUser
			{
				Email = "Jimmy@mail.com",
				UserName = "Jimmy",
				Description = "My fitness account",
				Id = id
			};

			context.Users.Add(appUser);
			context.SaveChanges();

			#endregion

			//act
			ApplicationUsersController applicationUsersController = new ApplicationUsersController(context);
			var result = applicationUsersController.GetUser(id);

			// Assert
			Assert.Equal(email, result.Result.Value.Email);
		}

		//Write unit test to verify that user data can be stored with PUT
		[Fact]
		public async void UserIsStored()
		{
			//arrange
			#region context preperation

			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: "TestDB")
				.Options;

			var operationalStoreOptions = Options.Create(
				new OperationalStoreOptions
				{
					DeviceFlowCodes = new TableConfiguration("DeviceCodes"),
					PersistedGrants = new TableConfiguration("PersistedGrants")
				});
			var context = new ApplicationDbContext(options, operationalStoreOptions);
			#endregion

			#region data preperation

			string email = "Jimmy@mail.com";
			string id = "one-two-three";

			var appUser = new ApplicationUser
			{
				Email = "Jimmy@mail.com",
				UserName = "Jimmy",
				Description = "My fitness account",
				Id = id
			};
			#endregion

			//act
			ApplicationUsersController applicationUsersController = new ApplicationUsersController(context);
			await applicationUsersController.PutApplicationUser(id, appUser);

			// Assert
			Assert.Equal(email, context.Users.Find(id).Email);
		}
	}
}
