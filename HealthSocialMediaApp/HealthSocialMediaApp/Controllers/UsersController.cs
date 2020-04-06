using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthSocialMediaApp.Models;
using HealthSocialMediaApp.Data;
using Microsoft.AspNetCore.Authorization;

namespace HealthSocialMediaApp.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController
     : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users/a0e61ab9-ef88-470e-b0f0-9e06b1542c4f
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(string id)
        {
            var user = await (from u in _context.Users
                              where u.Id == id
                              let followees = (from f in u.Followees select f.FolloweeId)
                              let followers = (from f in u.Followers select f.FollowerId)
                              select new
                              {
                                  u.Id,
                                  u.UserName,
                                  u.Description,
                                  u.Email,
                                  followers,
                                  followees
                              }
            ).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/users
        [HttpPut]
        public async Task<IActionResult> PutApplicationUser([FromBody] ApplicationUser editedUser)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == editedUser.Id);

            if (user == null)
            {
                return NotFound();
            }

            user.UserName = editedUser.UserName;
            user.Description = editedUser.Description;

            await _context.SaveChangesAsync();

            return StatusCode(200);
        }

        // GET: api/users/follows/id
        [HttpGet("follows")]
        public async Task<ActionResult<System.Collections.IEnumerable>> GetAllFollows(string profileUserId, string currentUserId)
        {
            var users = await (from user in _context.Users
                               join followerfollowee in _context.Followers on user.Id equals followerfollowee.FolloweeId
                               where followerfollowee.FollowerId == profileUserId
                               select new
                               {
                                   user.Id,
                                   user.UserName,
                                   user.Description
                               }).ToListAsync();
            return users;
        }

        // GET: api/users/follows/id
        [HttpGet("followers")]
        public async Task<ActionResult<System.Collections.IEnumerable>> GetAllFollowers(string profileUserId, string currentUserId)
        {
            var users = await (from user in _context.Users
                               join followerfollowee in _context.Followers on user.Id equals followerfollowee.FollowerId
                               where followerfollowee.FolloweeId == profileUserId
                               select new
                               {
                                   user.Id,
                                   user.UserName,
                                   user.Description
                               }).ToListAsync();
            return users;
        }

        // PUT: api/users/follow
        [HttpPut("follow")]
        public async Task<IActionResult> PutFollow(string followerid, string followeeId)
        {
            if (followeeId == followerid)
            {
                return BadRequest();
            }

            var follow = new FollowerFollowee
            {
                FollowerId = followerid,
                FolloweeId = followeeId
            };

            _context.Followers.Add(follow);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(followerid))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/users/unfollow
        [HttpPut("unfollow")]
        public async Task<IActionResult> PutUnFollow(string followerId, string followeeId)
        {
            FollowerFollowee follow = _context.Followers.Where(o => o.FollowerId == followerId && o.FolloweeId == followeeId).FirstOrDefault();

            if (follow == null)
            {
                return BadRequest();
            }

            _context.Followers.Remove(follow);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(followerId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(200);
        }

        private bool UserExists(string id)
        {
            return _context.Users.Any(a => a.Id == id);
        }
    }
}
