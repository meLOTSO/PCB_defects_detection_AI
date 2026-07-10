using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddSingleton<YoloDetectorService>();

var app = builder.Build();
app.UseCors();

app.MapPost("/detect", async (HttpRequest request, YoloDetectorService service) =>
{
    var form = await request.ReadFormAsync();
    var files = form.Files.GetFiles("images");

    if (files is null || files.Count == 0)
        return Results.BadRequest(new { error = "Не загружено ни одного изображения" });

    var confidenceStr = form["confidence_threshold"].FirstOrDefault() ?? "0.8";
    if (!float.TryParse(confidenceStr, System.Globalization.NumberStyles.Float,
        System.Globalization.CultureInfo.InvariantCulture, out float confidence))
        confidence = 0.8f;

    var traceDefectsNames = form["trace_defects"]
        .Where(x => x is not null)
        .Select(x => x!)
        .ToList();

    var pcbDefectsNames = form["pcb_defects"]
        .Where(x => x is not null)
        .Select(x => x!)
        .ToList();

    var modelsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Models");
    var traceDefectsModel = Path.Combine(modelsDirectory, "best_trace_defects.pt");
    var pcbDefectsModel = Path.Combine(modelsDirectory, "best_pcb_defects.pt");

    var traceDefectsResult = await service.DetectDefectsBatch(traceDefectsModel, 226, files, traceDefectsNames, confidence);
    var pcbDefectsResult = await service.DetectDefectsBatch(pcbDefectsModel, 640, files, pcbDefectsNames, confidence);

    var combineResult = new
    {
        success = true,
        trace_defects = traceDefectsResult,
        pcb_defects = pcbDefectsResult
    };

    Console.WriteLine($"COMBINE RESULT: {JsonSerializer.Serialize(combineResult)}");

    return Results.Ok(combineResult);
});

app.Run("http://localhost:5000");
