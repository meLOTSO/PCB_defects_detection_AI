using System.Diagnostics;
using System.Text.Json;
using System.Text;

public class YoloDetectorService
{
    private readonly string _pythonPath = "python";
    private readonly string _scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", "detect_api.py");

    public async Task<object> DetectDefectsBatch(
        string modelPath,
        int imageSize,
        IReadOnlyList<IFormFile> imageFiles,
        List<string> classNames,
        float confidenceThreshold)
    {
        var tempPaths = new List<string>();
        var filenames = new List<string>();
        foreach (var file in imageFiles)
        {
            var tempPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".jpg");
            filenames.Add(file.Name);
            using (var stream = File.Create(tempPath))
            {
                await file.CopyToAsync(stream);
            }
            tempPaths.Add(tempPath);
        }

        try
        {
            string pathsJson = JsonSerializer.Serialize(tempPaths);
            string classesJson = JsonSerializer.Serialize(classNames);
            string confidenceStr = confidenceThreshold.ToString(System.Globalization.CultureInfo.InvariantCulture);

            string escapedPathsJson = pathsJson.Replace("\"", "\\\"");
            string escapedClassesJson = classesJson.Replace("\"", "\\\"");

            string arguments = $"\"{_scriptPath}\" \"{modelPath}\" \"{imageSize}\" \"{escapedPathsJson}\" \"{escapedClassesJson}\" {confidenceStr}";

            Console.WriteLine($"DEBUG: Аргументы: {arguments}");

            var startInfo = new ProcessStartInfo
            {
                FileName = _pythonPath,
                Arguments = arguments,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
                WorkingDirectory = Directory.GetCurrentDirectory(),
                StandardOutputEncoding = Encoding.UTF8,
                StandardErrorEncoding = Encoding.UTF8
            };

            using var process = Process.Start(startInfo);
            string output = await process!.StandardOutput.ReadToEndAsync();
            Console.WriteLine($"OUTPUT: {output}");
            string error = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();

            if (!string.IsNullOrEmpty(error))
            {
                Console.WriteLine($"Python stderr: {error}");
            }

            if (process.ExitCode != 0)
            {
                throw new Exception($"Ошибка в Python (код {process.ExitCode}): {error}");
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var result = JsonSerializer.Deserialize<BatchDetectionResponse>(output, options);

            if (result is null)
                return new { error = "Пустой ответ от Python" };

            return result;
        }
        finally
        {
            foreach (var path in tempPaths)
            {
                if (File.Exists(path))
                    File.Delete(path);
            }
        }
    }
}

