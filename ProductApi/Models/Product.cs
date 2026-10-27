using System.ComponentModel.DataAnnotations;

namespace ProductApi.Models;

public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    public int Quantity { get; set; }
}
