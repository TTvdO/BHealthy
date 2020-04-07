using System.Linq;
using System.Threading.Tasks;
using HealthSocialMediaApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<System.Collections.IEnumerable>> GetSearchedUsers(string searchQuery)
        {
            var usersMatchingInput = await (from user in _context.Users
                                            where (searchQuery != null && user.UserName.ToLower().Trim().Contains(searchQuery.ToLower().Trim()))
                                            select new
                                            {
                                                user.Id,
                                                user.UserName
                                            }).ToListAsync();

            return usersMatchingInput;
        }
    }
}

