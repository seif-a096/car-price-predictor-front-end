import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FieldConfig } from '../types';

interface FormFieldProps {
  config: FieldConfig;
  value: string | number;
  onChange: (key: string, value: string | number) => void;
}

export default function FormField({ config, value, onChange }: FormFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleChange = (raw: string) => {
    if (config.type === 'number') {
      if (raw === '' || raw === '-') {
        onChange(config.key, raw === '' ? ('' as unknown as number) : ('-' as unknown as number));
        return;
      }
      let num = Number(raw);
      if (!isNaN(num)) {
        if (config.min !== undefined && num < config.min) {
          num = config.min;
        } else if (config.max !== undefined && num > config.max) {
          num = config.max;
        }
      }
      onChange(config.key, isNaN(num) ? raw : num);
    } else {
      onChange(config.key, raw);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      className="field"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <label className="field-label" htmlFor={`field-${config.key}`}>
        <span className="required-dot" />
        {config.label}
      </label>

      <span className="field-caption">
        {config.caption}
        {config.showDefaultHint && (
          <>, <em style={{ color: 'var(--text-tertiary)' }}>leave default if unsure</em></>
        )}
      </span>

      {config.type === 'select' ? (
        <div className="custom-select" ref={selectRef}>
          <div
            className={`custom-select-button ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{value}</span>
            <svg
              className="custom-select-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="custom-select-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {config.options!.map((opt) => (
                  <div
                    key={opt}
                    className={`custom-select-option ${value === opt ? 'selected' : ''}`}
                    onClick={() => handleChange(opt)}
                  >
                    {opt}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <input
          id={`field-${config.key}`}
          type="number"
          step={config.step ?? 'any'}
          min={config.min}
          max={config.max}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={String(config.default)}
          required
        />
      )}
    </motion.div>
  );
}
