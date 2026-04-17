import {z} from 'zod'

export const registerSchema = z.object({
    email: z
      .string()
      .min(1,'Email required')
      .email('Invalid email address'),

    role: z
      .enum(['RECRUITER','CANDIDATE']),

    password: z
      .string()
      .min(8, 'Minimum 8 characthters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),

    confirmPassword: z
      .string()
      .min(1,'Please confirm your password')
}).refine(
    (data) => data.password === data.confirmPassword,{
        message:'Passwords do not match',
        path: ['confirmPassword']
    }
)

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email required")
        .email("invalide email address"),
    password: z
      .string()
      .min(1, "password required")

})

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>