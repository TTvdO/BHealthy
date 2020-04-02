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
    public class ApplicationUsersController
     : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApplicationUsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/applicationusers/a0e61ab9-ef88-470e-b0f0-9e06b1542c4f
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(string id)
        {
            var user = await (from u in _context.Users
                              where u.Id == id
                              select new
                              {
                                  u.Id,
                                  u.UserName,
                                  u.Description,
                                  u.Email,
                                  u.Followees,
                                  u.Followers
                              }
            ).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/applicationusers
        [HttpPut]
        public async Task<IActionResult> PutApplicationUser([FromBody] ApplicationUser editedApplicationUser)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == editedApplicationUser.Id);

            if (user == null)
            {
                return NotFound();
            }

            user.UserName = editedApplicationUser.UserName;
            user.Description = editedApplicationUser.Description;

            await _context.SaveChangesAsync();

            return StatusCode(200);
        }

        // GET: api/applicationusers/follows/id
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

        // GET: api/applicationusers/follows/id
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

        // PUT: api/applicationusers/follow
        [Authorize]
        [HttpPut("follow")]
        public async Task<IActionResult> PutFollow(string userId, string followUserName)
        {
            string followeeId = _context.Users.Where(o => o.UserName == followUserName).FirstOrDefault().Id;

            if (followeeId == userId)
            {
                return BadRequest();
            }

            var follow = new FollowerFollowee
            {
                FollowerId = userId,
                FolloweeId = followeeId
            };

            _context.Followers.Add(follow);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationUserExists(userId))
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

        // PUT: api/applicationusers/unfollow
        [Authorize]
        [HttpPut("unfollow")]
        public async Task<IActionResult> PutUnFollow(string userId, string followUserName)
        {
            string followId = _context.Users.Where(o => o.UserName == followUserName).FirstOrDefault().Id;
            FollowerFollowee follow = _context.Followers.Where(o => o.FollowerId == userId && o.FolloweeId == followId).FirstOrDefault();
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
                if (!ApplicationUserExists(userId))
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

        private bool ApplicationUserExists(string id)
        {
            return _context.Users.Any(a => a.Id == id);
        }
    }
}
