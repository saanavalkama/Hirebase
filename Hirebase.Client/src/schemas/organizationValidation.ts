import z from "zod";

export const organizationValidation = z.object({
    name: z.string().min(1,"Name required").max(50),
    websiteUrl: z.string().optional().refine(val => !val || z.url().safeParse(val).success, "Invalid URL"),
    location: z.string().min(1).max(50).optional(),
})


export type Organization = z.infer<typeof organizationValidation>
