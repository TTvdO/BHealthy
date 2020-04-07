using Xunit;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Controllers;
using HealthSocialMediaApp.Data;
using Microsoft.AspNetCore.Routing;

namespace HealthSocialMediaUnitTest
{
    public class SearchControllerTest
    {
        [Fact]
        async public void UsersCanBeSearched()
        {
            //Arrange
            #region context preperation

            var context = DbContextCreator.CreateTestContext("SearchTestDB");

            #endregion

            #region data preparation

            var userOne = new ApplicationUser
            {
                Email = "SpecificUserName@mail.com",
                UserName = "SpecificUsername01",
                Description = "Bodybuilding guy",
                Id = "specificusername-id"
            };
            context.Users.Add(userOne);

            var userTwo = new ApplicationUser
            {
                Email = "VerySpecificUsername@mail.com",
                UserName = "VerySpecificUsername999",
                Description = "The best fitness account",
                Id = "veryspecificusername-id"
            };
            context.Users.Add(userTwo);

            await context.SaveChangesAsync();

            #endregion

            //Act
            SearchController searchController = new SearchController(context);

            string searchQueryOne = "VerySpecificUsername999";
            string searchQueryTwo = "specificusername0 ";

            var resultOne = searchController.GetSearchedUsers(searchQueryOne);
            var resultTwo = searchController.GetSearchedUsers(searchQueryTwo);

            bool[] arrayOne = SearchUserLoop(searchQueryOne, resultOne);

            bool onlyOneUserInFirstResult = arrayOne[0];
            bool specificUserInFirstResult = arrayOne[1];

            bool[] arrayTwo = SearchUserLoop(searchQueryTwo, resultTwo);

            bool onlyOneUserInSecondResult = arrayTwo[0];
            bool specificUserInSecondResult = arrayTwo[1];

            //Assert
            Assert.True(onlyOneUserInFirstResult);
            Assert.True(specificUserInFirstResult);

            Assert.True(onlyOneUserInSecondResult);
            Assert.True(specificUserInSecondResult);
        }

        public bool[] SearchUserLoop(string searchPhrase, System.Threading.Tasks.Task<Microsoft.AspNetCore.Mvc.ActionResult<System.Collections.IEnumerable>> result)
        {
            bool onlyOneUser = true;
            bool specificUserFound = true;

            foreach (var user in result.Result.Value)
            {
                //code to get parameter of an anonymous object (System.Collections.Generic in Controller made it hard to get specific attribute of the object found).
                //see https://stackoverflow.com/a/14877416 + https://docs.microsoft.com/en-us/dotnet/api/system.web.routing.routevaluedictionary?view=netframework-4.8
                var dictionary = new RouteValueDictionary(user);
                string usernameOfAnonymousObject = dictionary["UserName"] as string;

                if (!usernameOfAnonymousObject.ToLower().Trim().Contains(searchPhrase.ToLower().Trim()))
                {
                    onlyOneUser = false;
                }
                if (usernameOfAnonymousObject.Equals(searchPhrase))
                {
                    specificUserFound = true;
                }
            }

            bool[] arr = new bool[2];
            arr[0] = onlyOneUser;
            arr[1] = specificUserFound;

            return arr;
        }

        [Fact]
        async public void EmptySearchPhrasesReturnNothing()
        {
            var context = DbContextCreator.CreateTestContext("SearchTestDBEmptySearchPhrasesAreHandled");

            var user = new ApplicationUser
            {
                Email = "jimmy@mail.com",
                UserName = "Jimmy",
                Description = "I love fitness",
                Id = "jimmy-id"
            };
            context.Add(user);
            await context.SaveChangesAsync();

            SearchController searchController = new SearchController(context);

            var foundUsers = await searchController.GetSearchedUsers(null);

            var hasNoResults = true;
            foreach (var foundUser in foundUsers.Value)
            {
                hasNoResults = false;
            }

            Assert.True(hasNoResults);
        }
    }
}