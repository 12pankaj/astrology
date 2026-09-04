import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required')
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const BirthProfileSchema = z.object({
  name: z.string().min(1, 'Profile name is required'),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be YYYY-MM-DD'),
  tob: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'TOB must be HH:mm or HH:mm:ss'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  placeName: z.string().min(1, 'Place name is required'),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  timezoneId: z.string().default('Asia/Kolkata'),
  isPrimary: z.boolean().default(false)
});

export const KundliRequestSchema = z.object({
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tob: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezoneId: z.string().default('Asia/Kolkata'),
  ayanamsha: z.enum(['LAHIRI', 'RAMAN', 'KP', 'YUKTESHWAR']).default('LAHIRI')
});

export const KundliMatchingSchema = z.object({
  personA: BirthProfileSchema,
  personB: BirthProfileSchema
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type BirthProfileInput = z.infer<typeof BirthProfileSchema>;
export type KundliRequestInput = z.infer<typeof KundliRequestSchema>;
export type KundliMatchingInput = z.infer<typeof KundliMatchingSchema>;
