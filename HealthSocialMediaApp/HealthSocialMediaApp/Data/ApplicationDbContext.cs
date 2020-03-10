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

            builder.Entity<ApplicationUser>().Property(p => p.Description).HasMaxLength(512);
            builder.Entity<ApplicationUser>().HasMany<Post>(c => c.Posts).WithOne(p => p.ApplicationUser);

        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
    }
}