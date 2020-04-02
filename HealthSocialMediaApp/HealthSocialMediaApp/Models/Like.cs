namespace HealthSocialMediaApp.Models
{
    public class Like
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}