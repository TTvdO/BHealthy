namespace HealthSocialMediaApp.Models
{
	public class FollowerFollowee
	{
		public string FollowerId { get; set; }

		public ApplicationUser Follower { get; set; }

		public string FolloweeId { get; set; }

		public ApplicationUser Followee { get; set; }

	}
}
