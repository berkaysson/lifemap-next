/**
 * An array of public routes.
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/about-us",
  "/auth/new-verification",
  "/auth/new-password",
];

/**
 * An array of authentication routes.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
];

/**
 * The route for API authentication.
 * @type {string}
 */
export const apiAuthRoute = "/api/auth";

/**
 * The default redirect route after successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * The main domain of the application.
 * @type {string}
 */
export const MAIN_DOMAIN = "https://lifemap-next.vercel.app";
