import { motion } from 'framer-motion';
import type { FieldConfig } from '../types';
import FormField from './FormField';

interface FieldGroupProps {
  title: string;
  description: string;
  fields: FieldConfig[];
  values: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
  index: number;
}

export default function FieldGroup({ title, description, fields, values, onChange, index }: FieldGroupProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    >
      {index > 0 && <div className="section-divider" />}

      <div className="section-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="form-grid">
        {fields.map((field) => (
          <FormField
            key={field.key}
            config={field}
            value={values[field.key]}
            onChange={onChange}
          />
        ))}
      </div>
    </motion.section>
  );
}
