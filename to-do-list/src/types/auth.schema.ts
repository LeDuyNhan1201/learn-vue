import {z} from 'zod';

export const jwtPayload = z.object({
    sub: z.string(),
    exp: z.number(),
    iat: z.number(),
});
export type JwtPayload = z.infer<typeof jwtPayload>;

export const accessToken = z.string();
export type AccessToken = z.infer<typeof accessToken>;

export const refreshToken = z.string();
export type RefreshToken = z.infer<typeof refreshToken>;

export const refreshTokenPayload = jwtPayload;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayload>;

export const tokensResponse = z.object({
    accessToken: accessToken,
    refreshToken: refreshToken,
});
export type TokensResponse = z.infer<typeof tokensResponse>;

export const userClaims = z.object({
    id: z.uuid(),
    username: z.string().min(6).max(20),
    email: z.email(),
    roles: z.array(z.string()),
});
export type UserClaims = z.infer<typeof userClaims>;

export const signInRequest = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
});
export type SignInRequest = z.infer<typeof signInRequest>;

export const refreshRequest = z.object({
    refreshToken: refreshToken,
});
export type RefreshRequest = z.infer<typeof refreshRequest>;

export const signUpRequest = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.email(),
    password: z.string().min(6).max(20),
    confirmationPassword: z.string().min(6).max(20),
    acceptTerms: z.boolean().default(false),
});
export type SignUpRequest = z.infer<typeof signUpRequest>;