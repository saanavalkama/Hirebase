import z from "zod";

export const organizationValidation = z.object({
    name: z.string().min(1,"Name required").max(30),
    websiteUrl: z.string().optional().refine(val => !val || z.url().safeParse(val).success, "Invalid URL"),
    location: z.string().min(1).max(30).optional(),
})


export type Organization = z.infer<typeof organizationValidation>
