using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HealthSocialMediaApp.Migrations
{
    public partial class Addseedfordummyuserandpost : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Description", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "19214eae-430c-40c5-a6aa-8c93ce16df2a", 0, "24734549-5216-4b0a-bfc4-5bc69f848054", "I love sharing healthy tips for beginning health enthusiasts!", "beauhealthy@example.com", false, false, null, null, null, null, null, false, "919984af-6f91-42fc-91be-e5af37e1c929", false, "Beau Healthy" });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "ApplicationUserId", "CategoryId", "CreatedAt", "Description", "ImageLink" },
                values: new object[] { -1, "19214eae-430c-40c5-a6aa-8c93ce16df2a", 1, new DateTime(2020, 3, 24, 13, 55, 31, 411, DateTimeKind.Local).AddTicks(7104), "Hi guys. I just saw a cool health trick. What do you think?", "https://img1.thelist.com/img/gallery/weird-but-good-stuff-you-should-be-putting-in-your-smoothie/intro-1498667247.jpg" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: -1);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "19214eae-430c-40c5-a6aa-8c93ce16df2a");
        }
    }
}
