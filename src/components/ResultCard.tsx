import { motion, AnimatePresence } from 'framer-motion';

interface ResultCardProps {
  price: number | null;
  error: string | null;
}

export default function ResultCard({ price, error }: ResultCardProps) {
  return (
    <div className="result-container">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            className="error-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            <p>{error}</p>
          </motion.div>
        )}

        {price !== null && !error && (
          <motion.div
            key="result"
            className="result-card"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <p className="result-label">Estimated Vehicle Price</p>

            <motion.p
              className="result-price"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>

            <motion.p
              className="result-disclaimer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              This estimate is derived from a model trained on the 1985 Automobile Dataset. 
              Prices reflect historical market conditions and should not be interpreted as 
              current valuations. The prediction service undergoes periodic maintenance and 
              model updates approximately every two months.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
