import Joi from 'joi';

/**
 * Authoritative environment variable validation schema.
 * The application will not start if required variables are missing or malformed.
 */
export const envValidationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),

  // Redis (optional at startup – required at runtime for realtime features)
  REDIS_URL: Joi.string().optional().default('redis://localhost:6379'),

  // Cloudinary (optional at startup – required for media upload)
  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),

  // Server
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().integer().min(1024).max(65535).default(3001),

  // CORS
  NEXT_PUBLIC_API_URL: Joi.string().uri().optional().default('http://localhost:3000'),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // Business rules
  DAILY_ROOM_CREATION_LIMIT: Joi.number().integer().min(1).max(100).default(15),
  ROOM_GRACE_PERIOD_HOURS: Joi.number().integer().min(1).max(168).default(24),
  APPLICATION_TIMEZONE: Joi.string().default('UTC'),
});
