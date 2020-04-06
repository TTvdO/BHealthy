using LaunchDarkly.Client;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace HealthSocialMediaApp
{
    public class FeatureFlags
    {
        public const string ImageUpload = "image-upload";

        private static LdClient ldClient = null;

        private static LdClient Instance
        {
            get
            {
                if (ldClient == null)
                {
                    ldClient = new LdClient("sdk-7a1a3609-3b3c-46ba-8074-d542ae93b2c5");
                }
                return ldClient;
            }
        }

        public static bool IsEnabled(string feature, IWebHostEnvironment env)
        {
            var client = FeatureFlags.Instance;

            return (client.BoolVariation(feature, null) && env.IsProduction()) || env.IsDevelopment();
        }
    }
}
