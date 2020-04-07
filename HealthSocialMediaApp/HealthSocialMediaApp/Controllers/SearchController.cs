using System.Linq;
using System.Threading.Tasks;
using HealthSocialMediaApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace HealthSocialMediaApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SearchController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<System.Collections.IEnumerable>> GetSearchedUsers(string searchInput)
        {
            var usersMatchingInput = await (from user in _context.Users
                                            where (user.UserName.ToLower().Trim().Contains(searchInput.ToLower().Trim()))
                                            select new
                                            {
                                                user.Id,
                                                user.UserName
                                            }).ToListAsync();

            return usersMatchingInput;
        }
    }
}

