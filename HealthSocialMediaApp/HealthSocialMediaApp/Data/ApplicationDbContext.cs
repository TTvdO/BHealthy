using HealthSocialMediaApp.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthSocialMediaApp.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Category>().HasKey(c => c.Id);
            builder.Entity<Category>().Property(c => c.Name).IsRequired().HasMaxLength(128);
            builder.Entity<Category>().HasMany<Post>(c => c.Posts).WithOne(p => p.Category);

            builder.Entity<Post>().HasKey(p => p.Id);
            builder.Entity<Post>().Property(p => p.ImageLink).IsRequired().HasMaxLength(256);
            builder.Entity<Post>().Property(p => p.Description).IsRequired().HasMaxLength(512);
            builder.Entity<Post>().Property(p => p.CreatedAt).IsRequired().HasColumnType("date");
            builder.Entity<Post>().HasOne<ApplicationUser>(p => p.ApplicationUser).WithMany(a => a.Posts);
            builder.Entity<Post>().HasMany<Like>(p => p.Likes).WithOne(l => l.Post);

            builder.Entity<ApplicationUser>().Property(p => p.Description).HasMaxLength(512);
            builder.Entity<ApplicationUser>().HasMany<Post>(c => c.Posts).WithOne(p => p.ApplicationUser);
            builder.Entity<ApplicationUser>().HasMany<Like>(a => a.Likes).WithOne(l => l.ApplicationUser);

            builder.Entity<Like>().HasKey(l => l.Id);
            builder.Entity<Like>().HasOne<Post>(l => l.Post).WithMany(p => p.Likes);
            builder.Entity<Like>().HasOne<ApplicationUser>(l => l.ApplicationUser).WithMany(a => a.Likes);

            // Seeding
            var foodCategory = new Category
            {
                Id = 1,
                Name = "Food"
            };

            var dummyUser = new ApplicationUser
            {
                UserName = "Beau Healthy",
                Description = "I love sharing healthy tips for beginning health enthusiasts!",
                Email = "beauhealthy@example.com",
            };

            var examplePost = new Post
            {
                Id = -1,
                ApplicationUserId = dummyUser.Id,
                CategoryId = foodCategory.Id,
                Description = "Hi guys. I just saw a cool health trick. What do you think?",
                ImageLink = "https://img1.thelist.com/img/gallery/weird-but-good-stuff-you-should-be-putting-in-your-smoothie/intro-1498667247.jpg",
                CreatedAt = DateTime.Now
            };

            builder.Entity<Category>().HasData(foodCategory);
            builder.Entity<ApplicationUser>().HasData(dummyUser);
            builder.Entity<Post>().HasData(examplePost);
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }

        public DbSet<Like> Likes { get; set; }
    }
}