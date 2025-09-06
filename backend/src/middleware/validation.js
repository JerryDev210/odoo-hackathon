import Joi from 'joi';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }
    next();
  };
};

// Validation schemas
const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const productSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(1000).required(),
  price: Joi.number().positive().required(),
  categoryId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).optional(),
  condition: Joi.string().valid('new', 'like-new', 'good', 'fair', 'poor').required(),
  yearOfManufacture: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  brand: Joi.string().optional(),
  model: Joi.string().optional(),
  material: Joi.string().optional(),
  color: Joi.string().optional(),
  originalPackaging: Joi.boolean().optional(),
  manualIncluded: Joi.boolean().optional(),
  workingConditionDesc: Joi.string().optional(),
  length: Joi.number().positive().optional(),
  width: Joi.number().positive().optional(),
  height: Joi.number().positive().optional(),
  weight: Joi.number().positive().optional()
});

const categorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().max(200).optional()
});

const cartItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required()
});

export {
  validateRequest,
  userRegistrationSchema,
  userLoginSchema,
  productSchema,
  categorySchema,
  cartItemSchema
};
