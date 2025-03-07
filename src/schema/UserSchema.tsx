import Joi from 'joi';

export const UserSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required'
    }),
    firstname: Joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'string.empty': 'First name is required'
    }),
    lastname: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.empty': 'Last name is required'
    }),
    password: Joi.string().min(8).max(30).pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,30}$')).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 30 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, a number and a special charactere #?!@$%^&*-.',
      'string.empty': 'Password is required'
    })
  });