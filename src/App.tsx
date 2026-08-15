import { useState, useCallback, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { fieldGroups, getDefaultValues } from './fieldConfig';
import { predictPrice } from './api';
import type { PredictionRequest } from './types';
import FieldGroup from './components/FieldGroup';
import ResultCard from './components/ResultCard';
import HeroGraphic from './components/HeroGraphic';

export default function App() {
  const [values, setValues] = useState<Record<string, string | number>>(getDefaultValues);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((key: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrice(null);

    try {
      // Build payload with correct types
      const payload: PredictionRequest = {
        symboling: Number(values.symboling),
        normalized_losses: Number(values.normalized_losses),
        wheel_base: Number(values.wheel_base),
        length: Number(values.length),
        width: Number(values.width),
        height: Number(values.height),
        curb_weight: Number(values.curb_weight),
        engine_size: Number(values.engine_size),
        bore: Number(values.bore),
        stroke: Number(values.stroke),
        compression_ratio: Number(values.compression_ratio),
        horsepower: Number(values.horsepower),
        peak_rpm: Number(values.peak_rpm),
        city_L_100km: Number(values.city_L_100km),
        highway_mpg: Number(values.highway_mpg),
        num_of_doors: Number(values.num_of_doors),
        num_of_cylinders: Number(values.num_of_cylinders),
        make: String(values.make),
        fuel_type: String(values.fuel_type),
        aspiration: String(values.aspiration),
        body_style: String(values.body_style),
        drive_wheels: String(values.drive_wheels),
        engine_location: String(values.engine_location),
        engine_type: String(values.engine_type),
        fuel_system: String(values.fuel_system),
      };

      const result = await predictPrice(payload);
      setPrice(result.predicted_price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background gradient mesh */}
      <div className="bg-mesh" />

      <div className="app-container">
        {/* ── Hero ────────────────────────────────────────── */}
        <header className="hero">
          <div className="hero-grid">
            {/* Left: Text */}
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1>
                Predict Car Prices<br />
                with <span className="accent-text">AutoValue AI</span>
              </h1>

              <p className="hero-subtitle">
                Enter your vehicle's specifications below and receive an instant price estimation.
              </p>
            </motion.div>

            {/* Right: Graphic */}
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            >
              <HeroGraphic />
            </motion.div>
          </div>
        </header>

        {/* ── Info Banner ─────────────────────────────────── */}
        <motion.div
          className="info-banner"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
        >
          <span className="info-banner-icon">💡</span>
          <p>
            <strong>Not sure about a value?</strong> Each technical field comes pre-filled
            with a sensible default derived from dataset averages. If you're uncertain about
            specifications like bore, stroke, or compression ratio, feel free to leave them
            as-is. The model will still produce a reasonable estimate.
          </p>
        </motion.div>

        {/* ── Form ────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} id="prediction-form">
          {fieldGroups.map((group, idx) => (
            <FieldGroup
              key={group.title}
              title={group.title}
              description={group.description}
              fields={group.fields}
              values={values}
              onChange={handleChange}
              index={idx}
            />
          ))}

          {/* ── Submit ──────────────────────────────────── */}
          <div className="predict-section">
            <motion.button
              type="submit"
              className="predict-btn"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : undefined}
              whileTap={!loading ? { scale: 0.98 } : undefined}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Get Price Estimate
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* ── Result / Error ──────────────────────────────── */}
        <ResultCard price={price} error={error} />

        {/* ── Footer & Project Card ────────────────────────── */}
        <motion.footer
          className="footer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* GitHub Repository Card */}
          <a
            href="https://github.com/seif-a096/car-price-predictor"
            target="_blank"
            rel="noopener noreferrer"
            className="repo-card"
          >
            <div className="repo-card-glow" />
            <div className="repo-card-content">
              <div className="repo-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div className="repo-card-details">
                <div className="repo-card-header">
                  <span className="repo-badge">GitHub Repository</span>
                  <span className="repo-name">seif-a096/car-price-predictor</span>
                </div>
                <p className="repo-desc">
                  Explore the full source code, trained machine learning model, and deployment pipeline on GitHub.
                </p>
              </div>
              <div className="repo-card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>
          </a>

          {/* Copyright & Rights Notice */}
          <div className="footer-bottom">
            <p className="copyright-text">
              © {new Date().getFullYear()} AutoValue AI. All rights reserved.
            </p>
            <p className="footer-credits">
              Trained on the{' '}
              <a
                href="https://archive.ics.uci.edu/ml/datasets/automobile"
                target="_blank"
                rel="noopener noreferrer"
              >
                1985 Automobile Dataset
              </a>
              {' '}· Backend hosted on Railway
            </p>
          </div>
        </motion.footer>
      </div>
    </>
  );
}
