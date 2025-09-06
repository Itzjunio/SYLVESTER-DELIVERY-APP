import rateLimit from "express-rate-limit";


export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password reset attempts. Try again later." },
});
