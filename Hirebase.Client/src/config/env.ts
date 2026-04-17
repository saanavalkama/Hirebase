const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

interface Env{
    apiBaseUrl:string
}

if(!apiBaseUrl) throw new Error('Could not resolve base url')

export const env:Env = {
    apiBaseUrl
}