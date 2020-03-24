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

    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<System.Collections.IEnumerable>> GetPosts(string currentUserId, string userName)
        {
            var post = await (from p in _context.Posts
                              let likeCount = (from like in _context.Likes where like.PostId == p.Id select like.Id).Count()
                              let likedByUser = currentUserId != null ? (from like in _context.Likes where like.PostId == p.Id && like.ApplicationUserId == currentUserId select like.Id).Any() : false
                              where (userName != null ? p.ApplicationUser.UserName == userName : true)
                              select new
                              {
                                  p.Id,
                                  p.ImageLink,
                                  p.Description,
                                  p.CategoryId,
                                  p.CreatedAt,
                                  p.ApplicationUser.UserName,
                                  p.ApplicationUserId,
                                  amountOfLikes = likeCount,
                                  isLikedByCurrentUser = likedByUser
                              }).OrderByDescending(d => d.CreatedAt).ToListAsync();
            return post;
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            return post;
        }

        // PUT: api/Posts/5/like
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPut("{id}/like")]
        public async Task<ActionResult<Post>> PutPostLike(int id, string userId)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return BadRequest();
            }

            bool userAlreadyLikedPost = false;
            foreach (Like like in _context.Likes)
            {
                if (like.ApplicationUserId.Equals(userId) && like.PostId.Equals(id))
                {
                    userAlreadyLikedPost = true;
                }
            }

            if (userAlreadyLikedPost)
            {
                return BadRequest();
            }

            Like correspondingLike = new Like();
            correspondingLike.PostId = id;
            correspondingLike.ApplicationUserId = userId;

            _context.Likes.Add(correspondingLike);
            await _context.SaveChangesAsync();

            return StatusCode(200);
        }

        // PUT: api/Posts/5/unlike
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPut("{id}/unlike")]
        public async Task<ActionResult<Post>> PutPostUnlike(int id, string userId)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return BadRequest();
            }

            bool userHasNotLikedPost = true;
            foreach (Like like in _context.Likes)
            {
                if (like.ApplicationUserId.Equals(userId) && like.PostId.Equals(id))
                {
                    _context.Likes.Remove(like);
                    userHasNotLikedPost = false;
                }
            }

            if (userHasNotLikedPost)
            {
                return BadRequest();
            }

            await _context.SaveChangesAsync();

            return StatusCode(200);
        }

        // POST: api/Posts
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Post>> PostPost([FromBody] Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Post>> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return post;
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}
