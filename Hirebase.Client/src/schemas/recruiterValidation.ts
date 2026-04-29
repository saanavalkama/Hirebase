import z from "zod";

export const recruiterValidationSchema = z.object({
    name: z.string().min(1).max(50)
})

export type RecruiterValidationSchema = z.infer<typeof recruiterValidationSchema>