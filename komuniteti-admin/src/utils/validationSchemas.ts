import * as yup from 'yup';
import { UserRole } from '../store/slices/authSlice';

// Login validation schema
export const loginSchema = yup.object({
  email: yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string()
    .required('Password is required'),
});

// Registration validation schema
export const registerSchema = yup.object({
  name: yup.string()
    .required('Name is required'),
  email: yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string()
    .oneOf(['business_manager', 'administrator'] as UserRole[], 'Please select a valid role')
    .required('Role is required'),
});

// Forgot password validation schema
export const forgotPasswordSchema = yup.object({
  email: yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

// Reset password validation schema
export const resetPasswordSchema = yup.object({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
}); 