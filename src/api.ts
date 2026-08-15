import type { PredictionRequest, PredictionResponse } from './types';

/**
 * In development, requests go through the Vite proxy (/api/predict → Railway).
 * In production, they hit the Railway URL directly.
 */
const API_URL = import.meta.env.DEV
  ? '/api/predict'
  : 'https://car-price-predictor-production-fdec.up.railway.app/predict';

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
