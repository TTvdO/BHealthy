namespace HealthSocialMediaApp.Models
{
    public class FollowerFollowee
    {
        public string FollowerId { get; set; }

        public virtual ApplicationUser Follower { get; set; }

        public string FolloweeId { get; set; }

        public virtual ApplicationUser Followee { get; set; }

    }
}
