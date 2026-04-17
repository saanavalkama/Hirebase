namespace Hirebase.Domain.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string resource)
        : base($"{resource} not found"){}
}

public class ForbiddenException : Exception
{
    public ForbiddenException(string message)
        : base(message){}
}

public class ConflictException : Exception
{
    public ConflictException(string message)
        : base(message){}
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) 
        : base(message) { }
}

public class BadRequestError : Exception
{
    public BadRequestError(string message) : base(message)
    {
        
    }
}