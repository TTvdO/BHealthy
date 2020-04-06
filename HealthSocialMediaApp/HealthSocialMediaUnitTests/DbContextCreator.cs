using HealthSocialMediaApp.Data;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Options;
using System.Collections.Generic;

namespace HealthSocialMediaUnitTest
{
    /// <summary>
    /// Use this class to instantiate a db context. It ensures there are no duplicate db context names
    /// </summary>
    public static class DbContextCreator
    {
        private static List<string> usedDbNames = new List<string>();

        private static bool IsNameInUse(string dbName)
        {
            return usedDbNames.Contains(dbName);
        }

        public static ApplicationDbContext CreateTestContext(string name)
        {
            if (IsNameInUse(name))
            {
                throw new System.Exception("In memory database name is already in use. Please use a name that's different than " + name);
            }

            usedDbNames.Add(name);

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
    }
}
