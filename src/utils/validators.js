import { z } from 'zod';

// Registration rules for REQ-09. Each message is written for a patient, not for a developer.
const fullName = z
  .string({ required_error: 'Full name is required.' })
  .trim()
  .min(2, 'Full name must be at least 2 characters.')
  .max(60, 'Full name must be at most 60 characters.')
  .regex(/^[A-Za-zñÑ.'\-\s]+$/, 'Full name may only contain letters, spaces, periods, hyphens and apostrophes.');

const email = z
  .string({ required_error: 'Email address is required.' })
  .trim()
  .min(1, 'Email address is required.')
  .max(120, 'Email address must be at most 120 characters.')
  .email('Enter a valid email address, for example name@example.com.');

// PH mobile numbers: 09XXXXXXXXX or +639XXXXXXXXX.
const phone = z
  .string({ required_error: 'Mobile number is required.' })
  .trim()
  .regex(/^(09\d{9}|\+639\d{9})$/, 'Enter a PH mobile number as 09XXXXXXXXX or +639XXXXXXXXX.');

const password = z
  .string({ required_error: 'Password is required.' })
  .min(8, 'Password must be at least 8 characters.')
  .max(64, 'Password must be at most 64 characters.')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
  .regex(/[a-z]/, 'Password must contain a lowercase letter.')
  .regex(/\d/, 'Password must contain a number.');

const birthdate = z
  .string({ required_error: 'Birthdate is required.' })
  .min(1, 'Birthdate is required.')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid birthdate.')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00`);
    return date.getTime() <= Date.now();
  }, 'Birthdate cannot be in the future.')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00`);
    const age = (Date.now() - date.getTime()) / (365.25 * 24 * 3600 * 1000);
    return age <= 120;
  }, 'Birthdate must be within the last 120 years.');

export const registrationSchema = z
  .object({
    name: fullName,
    email,
    phone,
    birthdate,
    address: z
      .string({ required_error: 'Address is required.' })
      .trim()
      .min(5, 'Address must be at least 5 characters.')
      .max(120, 'Address must be at most 120 characters.'),
    password,
    confirmPassword: z.string({ required_error: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email address is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const symptomsSchema = z.object({
  symptoms: z
    .string()
    .trim()
    .min(10, 'Describe your symptoms in at least 10 characters.')
    .max(500, 'Describe your symptoms in at most 500 characters.'),
});

export const notesSchema = z.object({
  notes: z
    .string()
    .trim()
    .min(10, 'Consultation notes must be at least 10 characters.')
    .max(2000, 'Consultation notes must be at most 2000 characters.'),
});
