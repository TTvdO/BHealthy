using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthSocialMediaApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        //Id, Email and UserName already exist within IdentityUser

        public override string UserName { get; set; }

        public string Description { get; set; }

        public DateTime Birthday { get; set; }
    }
}
