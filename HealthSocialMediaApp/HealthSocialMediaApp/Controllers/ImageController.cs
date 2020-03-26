using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;

namespace HealthSocialMediaApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnv;

        public static readonly string imagesFolder = "images";
        public static readonly string imagesError = "Error: ";

        public ImagesController(IWebHostEnvironment hostingEnv)
        {
            _hostingEnv = hostingEnv;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Upload(IFormFile file)
        {
            if (!ImagesController.IsImage(file))
            {
                return ErrorResult("The file should be an image");
            }
            else
            {
                string fileName = Path.GetRandomFileName();
                string filePath = await SaveImageAsync(
                     file,
                     fileName,
                     _hostingEnv);

                if (filePath == "null")
                {
                    return ErrorResult("Image is null");
                }

                return Json(filePath);
            }

        }

        public static async Task<string> SaveImageAsync(
            IFormFile file,
            string imageName,
            IWebHostEnvironment hostingEnv)
        {

            if (file != null)
            {
                // Upload files to wwwroot
                var fileName = imageName += GetExtention(file);
                var filePath = Path.Combine(hostingEnv.WebRootPath, imagesFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Get the url to the image
                // Example of a URL: "../images/example.jpg"
                var fileUrl = "../" + imagesFolder + "/" + fileName;

                return fileUrl;
            }
            else
            {
                return "null";
            }
        }

        public static void DeleteImage(string imageLink, IWebHostEnvironment hostingEnv)
        {
            string toBeSearched = imagesFolder + "/";
            if (imageLink.Contains(toBeSearched))
            {
                string fileName = imageLink.Substring(
                    imageLink.IndexOf(toBeSearched) + toBeSearched.Length);

                var filePath = Path.Combine(hostingEnv.WebRootPath, imagesFolder, fileName);


                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

        }

        public static JsonResult ErrorResult(string message)
        {

            return new JsonResult(imagesError + message);
        }

        public static bool HasValidExtention(IFormFile file)
        {
            if (file != null)
            {
                List<string> validExtensions = new List<string> {
                    ".JPG",
                    ".JPE",
                    ".JPEG",
                    ".BMP",
                    ".GIF",
                    ".PNG"
                };

                return validExtensions.Contains(Path.GetExtension(file.FileName).ToUpper());
            }

            return false;
        }

        public static bool IsImage(IFormFile file)
        {
            return file.ContentType.StartsWith("image") && HasValidExtention(file);
        }

        public static string GetExtention(IFormFile file)
        {
            return Path.GetExtension(file.FileName);
        }
    }
}
