using System.ComponentModel.DataAnnotations;

namespace Hirebase.API.Settings;

public class ConnectionSettings{
    [Required(ErrorMessage = "DefaultConnection connectiion string is required")]
    public string DefaultConnection {get;set;} = string.Empty;
}