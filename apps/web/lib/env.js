const createEnv = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const uiJwtSecret = process.env.UI_JWT_SECRET ?? "dev-ui-secret";

  if (!apiUrl)
    throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
  if (!uiJwtSecret)
    throw new Error("Missing UI_JWT_SECRET environment variable");

  if (process.env.NODE_ENV !== "production") {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn(
        "[env] Falling back to default API URL http://localhost:4000"
      );
    }
    if (!process.env.UI_JWT_SECRET) {
      console.warn("[env] Falling back to default UI JWT secret");
    }
  }

  return { apiUrl, uiJwtSecret };
};

const env = createEnv();

export const resolveEnv = () => env;
