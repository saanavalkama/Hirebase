import { z } from 'zod'

export const candidateProfileSchema = z.object({
    name: z.string().max(50, "Name can be max 50 characters long").optional(),
    location: z.string().max(50, "Location can be max 50 characters long").optional(),
    bio: z.string().max(300, "Bio can be max 300 characters long").optional(),
    linkedInUrl: z.string().optional().refine(val => !val || z.url().safeParse(val).success, "Invalid URL"),
    personalSiteUrl: z.string().optional().refine(val => !val || z.url().safeParse(val).success, "Invalid URL"),
    cvUrl: z.string().optional().refine(val => !val || z.url().safeParse(val).success, "Invalid URL"),
    yearsOfExperience: z.number().int().min(0).max(50).optional(),
    salaryMin: z.number().min(0).max(10000000).optional(),
    salaryMax: z.number().min(0).max(10000000).optional(),
    availableFrom: z.string().optional(),
    seniorityLevel: z.enum(["Junior", "Mid", "Senior", "Lead"]).optional(),
    remotePreference: z.enum(["Remote", "Hybrid", "Onsite"]).optional(),
    softSkills: z.array(z.string()).max(3, "You can pick up to 3 soft skills").optional(),
    preferredRoles: z.array(z.string()).optional(),
})

export type CandidateSchema = z.infer<typeof candidateProfileSchema>
