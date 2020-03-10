using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthSocialMediaApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Description { get; set; }

        public virtual ICollection<Post> Posts { get; set; }
    }
}
