/**
 * Angular environment file — DEVELOPMENT.
 *
 * IMPORTANT: This file is bundled into the JS that ships to the browser.
 * NEVER put API keys, tokens, or other secrets here. Anything in this file
 * is visible to every user of the deployed app via browser DevTools.
 *
 * Secrets (e.g., the Cohere API key) live ONLY in the backend's `.env` file,
 * which is gitignored and read by FastAPI server-side.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api',
};
