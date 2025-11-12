import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { resolveEnv } from "./env";

const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("at_ui")?.value;
  if (!accessToken) return null;

  const { uiJwtSecret } = resolveEnv();

  try {
    const payload = jwt.verify(accessToken, uiJwtSecret);
    const userId = Number(payload?.uid);
    if (!Number.isFinite(userId) || !payload?.email) return null;

    return { id: userId, email: payload.email };
  } catch (error) {
    console.warn("[auth] Failed to verify access token", error);
    return null;
  }
};

export { getCurrentUser };
