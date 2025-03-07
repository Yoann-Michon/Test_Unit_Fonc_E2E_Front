import Joi from 'joi';

export const HotelSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': '"name" should be a type of text',
      'string.empty': '"name" cannot be an empty field',
      'string.min': '"name" should have a minimum length of 3',
      'string.max': '"name" should have a maximum length of 50',
      'any.required': '"name" is a required field'
    }),

  location: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': '"location" should be a type of text',
      'string.empty': '"location" cannot be an empty field',
      'string.min': '"location" should have a minimum length of 3',
      'string.max': '"location" should have a maximum length of 100',
      'any.required': '"location" is a required field'
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': '"price" should be a number',
      'number.positive': '"price" should be a positive number',
      'number.precision': '"price" should have at most 2 decimal places',
      'any.required': '"price" is a required field'
    }),

  description: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.base': '"description" should be a type of text',
      'string.max': '"description" should have a maximum length of 500'
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional()
    .messages({
      'array.base': '"images" should be an array',
      'array.items': '"images" should be an array of valid image URLs',
      'array.max': '"images" can contain a maximum of 5 images'
    })
});