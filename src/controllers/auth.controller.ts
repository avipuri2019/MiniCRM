import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';

//import helper/utils funtions
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { signupSchema, loginSchema } from '../utils/validation';
import { isValidEmail, sanitizeInput, hasSQLInjection } from '../utils/helpers';

//signup controller
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = signupSchema.parse(req.body);

    // Additional security checks
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    if (hasSQLInjection(email)) {
      res.status(400).json({ error: 'Invalid input detected' });
      return;
    }

    // Check if user already exists
    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password and create user
    const sanitizedEmail = sanitizeInput(email);
    const passwordHash = await hashPassword(password);
    const user = UserModel.create(sanitizedEmail, passwordHash, role);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.errors) {
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Additional security checks
    if (!isValidEmail(email)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (hasSQLInjection(email)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Find user
    const sanitizedEmail = sanitizeInput(email);
    const user = UserModel.findByEmail(sanitizedEmail);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.errors) {
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
