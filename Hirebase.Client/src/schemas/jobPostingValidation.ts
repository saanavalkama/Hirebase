import z from "zod";
import { LANGUAGES } from "@/features/recruiter/data/languages";

export const jobPostingValidation = z.object({
    organizationId: z.string().min(1,"Please choose organization"),
    title: z.string().min(1,"Title required").max(50),
    description: z.string().min(1,"description required"),
    seniorityLevel: z.enum(["Junior","Mid","Senior","Lead"]).optional(),
    salaryMin: z.int().min(0).max(10000000).optional(),
    salaryMax: z.int().min(0).max(10000000).optional(),
    lastApplicationDay: z.string().optional(),
    softSkills: z.array(z.string()).max(3,"you can pick only 3 soft skills"),
    remotePreference: z.enum(["Remote","Hybrid","Onsite"]).optional(),
    location: z.string().min(1).max(100).optional(),
    status: z.enum(["Draft","Open","Closed"]).optional(),
    preferredRole: z.array(z.string()).max(1).optional(),
    jobPostingSoftSkills: z.array(z.string()).max(3).optional(),
    requiredLanguages: z.array(z.enum(LANGUAGES)).optional()
})

export type JobPosting = z.infer<typeof jobPostingValidation>