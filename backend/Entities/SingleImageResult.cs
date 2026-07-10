public class SingleImageResult
{
    public bool Success { get; set; }
    public string Filename { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
    public string Error { get; set; } = string.Empty;
    public List<DefectInfo> Detections { get; set; } = [];
}