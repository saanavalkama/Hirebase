import axios from "axios";

export function getErrorMessage(error: unknown, fallback: string ="Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    if(typeof data?.error === "string"){    
        return data.error
    }

    //for fluentValidation errors, generic message
    if(typeof data?.error === "object"){
        return "Validation failed - check your inputs"
    }

}

    return fallback

}