using Xunit;
using HealthSocialMediaApp.Data;

namespace HealthSocialMediaUnitTest
{
    public class DbContextCreatorTest
    {
        [Fact]
        public void CanNotCreateContextWithExistingName()
        {
            string uniqueDbName = "ExampleName";

            ApplicationDbContext context = DbContextCreator.CreateTestContext(uniqueDbName);

            Assert.Throws<System.Exception>(() =>
            {
                ApplicationDbContext context = DbContextCreator.CreateTestContext(uniqueDbName);
            });
        }
    }
}
