import Joi from 'joi';


export const HotelSchema = Joi.object({
  id: Joi.string().optional(),
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
    street: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': '"street" should be a type of text',
      'string.empty': '"street" cannot be an empty field',
      'string.min': '"street" should have a minimum length of 3',
      'string.max': '"street" should have a maximum length of 100',
      'any.required': '"street" is a required field'
    }),

  location: Joi.string()
    .min(3)
    .max(200)
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

    picture_list: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.allow(null, '')
    )
    .optional()
});