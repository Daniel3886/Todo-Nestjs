export const AuthConfig = {
  jwtSecret: process.env.JWT_SECRET!,
  accessTokenExpiresIn: '15m' as const,
  refreshTokenExpiresIn: '7d' as const,
};
