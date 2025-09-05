import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  );

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  role: z.enum(['rep', 'manager']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional(),
  status: z.enum(['new', 'working', 'qualified', 'disqualified']).optional(),
});

export const accountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  industry: z.string().optional(),
});

export const activitySchema = z.object({
  type: z.enum(['call', 'email', 'demo']),
  notes: z.string().optional(),
  next_follow_up: z.string().datetime().optional(),
});

export const leadFilterSchema = z.object({
  status: z.enum(['new', 'working', 'qualified', 'disqualified']).optional(),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
});

/**
 * Validates password strength
 */
export const validatePassword = (password: string): boolean => {
  try {
    passwordSchema.parse(password);
    return true;
  } catch {
    return false;
  }
};
