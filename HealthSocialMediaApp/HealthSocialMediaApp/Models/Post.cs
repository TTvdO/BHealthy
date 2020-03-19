using System;
using System.Collections.Generic;

namespace HealthSocialMediaApp.Models
{
    public class Post
    {
        public int Id { get; set; }

        public string ImageLink { get; set; }

        public string Description { get; set; }

        public int CategoryId { get; set; }

        public string ApplicationUserId { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual Category Category { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }

        public virtual ICollection<Like> Likes { get; set; }
    }
}
