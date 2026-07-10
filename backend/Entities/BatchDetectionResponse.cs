public class BatchDetectionResponse
{
    public bool Success { get; set; }
    public int Total { get; set; }
    public List<SingleImageResult> Results { get; set; } = [];
}