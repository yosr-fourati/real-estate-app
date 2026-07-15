export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT) || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
