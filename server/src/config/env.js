import "dotenv/config";

export const env = {
  PORT: process.env.PORT || 5000,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  ACCESS_TOKEN_EXPIRES:
    process.env.ACCESS_TOKEN_EXPIRES || "15m",

  REFRESH_TOKEN_EXPIRES:
    process.env.REFRESH_TOKEN_EXPIRES || "7d",

  // Midtrans Configuration
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
  MIDTRANS_IS_PRODUCTION:
    process.env.MIDTRANS_IS_PRODUCTION === "true",
};