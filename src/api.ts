import type { PredictionRequest, PredictionResponse } from './types';

/**
 * Requests use `/api/predict`:
 * - In local development: Proxied to Railway by Vite (`vite.config.ts`)
 * - In production on Vercel: Proxied to Railway by Vercel Rewrites (`vercel.json`)
 * This avoids all browser CORS preflight blocks.
 */
const API_URL = import.meta.env.VITE_API_URL || '/api/predict';

/**
 * Sends the car feature data to the prediction endpoint and returns
 * the estimated price. Throws on network or server errors.
 */
export async function predictPrice(data: PredictionRequest): Promise<PredictionResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(
      `Prediction failed (${response.status}): ${text || 'The server returned an unexpected response. Please try again later.'}`,
    );
  }

  return response.json() as Promise<PredictionResponse>;
}
