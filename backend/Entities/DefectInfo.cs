public class DefectInfo
{
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public float Confidence { get; set; }
    public BoundingBoxInfo Bbox { get; set; } = null!;
}