using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthSocialMediaApp.Models
{
    public class Post
    {
        public int Id { get; set; }

        public string ImageLink { get; set; }

        public string Description { get; set; }

        public int CategoryId { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual Category Category { get; set; }
    }
}
