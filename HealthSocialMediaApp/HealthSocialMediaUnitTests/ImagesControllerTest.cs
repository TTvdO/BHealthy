using Xunit;
using HealthSocialMediaApp.Controllers;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;

namespace HealthSocialMediaUnitTest
{
    public class ImagesControllerTest
    {
        [Fact]
        public void FileHasImageExtention()
        {
            IFormFile textFile = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
                0, 0, "Data", "dummy.txt");

            IFormFile jpgFile = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
                0, 0, "Data", "dummy.jpg");

            IFormFile jpeFile = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
                0, 0, "Data", "dummy.jpe");

            IFormFile jpegFile = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
                0, 0, "Data", "dummy.jpeg");

            IFormFile bmpFile = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
                0, 0, "Data", "dummy.bmp");

            IFormFile gifFile = new FormFile(
               new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
               0, 0, "Data", "dummy.gif");

            IFormFile pngFile = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
                0, 0, "Data", "dummy.png");

            Assert.False(ImagesController.HasValidExtention(textFile));
            Assert.True(ImagesController.HasValidExtention(jpgFile));
            Assert.True(ImagesController.HasValidExtention(jpeFile));
            Assert.True(ImagesController.HasValidExtention(jpegFile));
            Assert.True(ImagesController.HasValidExtention(bmpFile));
            Assert.True(ImagesController.HasValidExtention(gifFile));
            Assert.True(ImagesController.HasValidExtention(pngFile));
        }

        [Fact]
        public void GetCorrectExtention()
        {
            IFormFile textFile = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("This is a dummy file")),
                0, 0, "Data", "dummy.txt");

            Assert.Equal(".txt", ImagesController.GetExtention(textFile));
        }
    }
}
