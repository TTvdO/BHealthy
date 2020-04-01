using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
        public async Task<ActionResult<ApplicationUser>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/applicationusers/follow
        [HttpGet("follow")]
        public async Task<ActionResult<bool[]>> GetFollowingUser(string currentUserId, string profileUserName)
        {
            bool[] followingProfileAndIsOwnProfile = new bool[2];
            bool followingCurrentProfile = false;
            bool isOwnProfile = false;

            var currentApplicationUser = await _context.Users.FindAsync(currentUserId);

            if (currentApplicationUser == null)
            {
                return NotFound();
            }

            //change to comparing ID's asap when this is changed in the front-end
            if (currentApplicationUser.UserName.Equals(profileUserName))
            {
                followingCurrentProfile = true;
                isOwnProfile = true;
            }

            else
            {
                if (_context.Followers != null)
                {
                    if (_context.Followers.Any())
                    {
                        //lookup user behind profile based on name, change to based on id asap when changed in front-end
                        ApplicationUser profileApplicationUser = null;
                        foreach (ApplicationUser applicationUser in _context.Users)
                        {
                            if (applicationUser.UserName.Equals(profileUserName))
                            {
                                profileApplicationUser = applicationUser;
                            }
                        }

                        foreach (FollowerFollowee followerFollowee in _context.Followers)
                        {
                            if (followerFollowee.FollowerId.Equals(currentUserId) &&
                                followerFollowee.FolloweeId.Equals(profileApplicationUser.Id))
                            {
                                followingCurrentProfile = true;
                            }
                        }
                    }

                }
            }

            followingProfileAndIsOwnProfile[0] = followingCurrentProfile;
            followingProfileAndIsOwnProfile[1] = isOwnProfile;
            return followingProfileAndIsOwnProfile;
        }

        // PUT: api/applicationuser/a0e61ab9-ef88-470e-b0f0-9e06b1542c4f
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplicationUser(string id, [FromBody] ApplicationUser applicationUser)
        {
            if (id != applicationUser.Id)
            {
                return BadRequest();
            }

            _context.Entry(applicationUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationUserExists(id))
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


        // PUT: api/applicationuser/follow
        [Authorize]
        [HttpPut("follow")]
        public async Task<IActionResult> PutFollow(string userId, string followUserName)
        {
            //GET FOLLOW USER ID
            string followId = _context.Users.Where(o => o.UserName == followUserName).FirstOrDefault().Id;

            if (followId == userId)
            {
                return BadRequest();
            }

            var follow = new FollowerFollowee
            {
                FollowerId = userId,
                FolloweeId = followId
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

        // PUT: api/applicationuser/unfollow
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
