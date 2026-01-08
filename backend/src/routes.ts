import { Router, Application } from "express";

/**
 * Route configuration interface
 */
interface RouteConfig {
  path: string;
  router: Router;
}

/**
 * API version prefix
 */
const API_VERSION = "/api";

const routes: RouteConfig[] = [];
/**
 * Register all routes with the Express application
 * @param app - Express application instance
 */
export const registerRoutes = (app: Application): void => {
  routes.forEach((route) => {
    app.use(`${API_VERSION}${route.path}`, route.router);
  });
};

/**
 * Get all registered route paths (useful for documentation/debugging)
 * @returns Array of route paths
 */
export const getRoutePaths = (): string[] => {
  return routes.map((route) => `${API_VERSION}${route.path}`);
};

/**
 * Export routes configuration for potential future use
 */
export default routes;
