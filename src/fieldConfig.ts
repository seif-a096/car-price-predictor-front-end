import type { FieldConfig } from './types';

/**
 * Complete field configuration for the car price prediction form.
 * Fields are grouped by category and each includes a human-friendly caption.
 */

// ── Vehicle Identity ──────────────────────────────────────────
export const vehicleIdentityFields: FieldConfig[] = [
  {
    key: 'make',
    label: 'Manufacturer',
    caption: 'The brand or manufacturer of the vehicle.',
    type: 'select',
    options: [
      'alfa-romero', 'audi', 'bmw', 'chevrolet', 'dodge', 'honda',
      'isuzu', 'jaguar', 'mazda', 'mercedes-benz', 'mercury',
      'mitsubishi', 'nissan', 'peugot', 'plymouth', 'porsche',
      'renault', 'saab', 'subaru', 'toyota', 'volkswagen', 'volvo',
    ],
    default: 'toyota',
    showDefaultHint: false,
  },
  {
    key: 'fuel_type',
    label: 'Fuel Type',
    caption: 'Primary fuel the engine uses.',
    type: 'select',
    options: ['gas', 'diesel'],
    default: 'gas',
    showDefaultHint: false,
  },
  {
    key: 'aspiration',
    label: 'Aspiration',
    caption: 'How air is fed to the engine, standard (std) or turbocharged (turbo).',
    type: 'select',
    options: ['std', 'turbo'],
    default: 'std',
    showDefaultHint: true,
  },
  {
    key: 'body_style',
    label: 'Body Style',
    caption: 'Shape of the vehicle body.',
    type: 'select',
    options: ['sedan', 'hatchback', 'wagon', 'hardtop', 'convertible'],
    default: 'sedan',
    showDefaultHint: false,
  },
  {
    key: 'num_of_doors',
    label: 'Number of Doors',
    caption: 'Total count of vehicle doors.',
    type: 'select',
    options: ['2', '4'],
    default: 4,
    showDefaultHint: false,
  },
  {
    key: 'drive_wheels',
    label: 'Drive Wheels',
    caption: 'Drivetrain layout - front-wheel (fwd), rear-wheel (rwd), or all-wheel (4wd).',
    type: 'select',
    options: ['fwd', 'rwd', '4wd'],
    default: 'fwd',
    showDefaultHint: true,
  },
  {
    key: 'engine_location',
    label: 'Engine Location',
    caption: 'Placement of the engine in the vehicle chassis.',
    type: 'select',
    options: ['front', 'rear'],
    default: 'front',
    showDefaultHint: true,
  },
];

// ── Risk & Insurance ──────────────────────────────────────────
export const riskFields: FieldConfig[] = [
  {
    key: 'symboling',
    label: 'Symboling (Risk Rating)',
    caption: 'Insurance risk rating strictly between −3 (safest) and +3 (riskiest).',
    type: 'number',
    default: 1,
    min: -3,
    max: 3,
    showDefaultHint: true,
    step: 1,
  },
  {
    key: 'normalized_losses',
    label: 'Normalized Losses',
    caption: 'Relative average loss payment per insured vehicle year.',
    type: 'number',
    default: 122,
    min: 0,
    showDefaultHint: true,
    step: 1,
  },
];

// ── Dimensions ────────────────────────────────────────────────
export const dimensionFields: FieldConfig[] = [
  {
    key: 'wheel_base',
    label: 'Wheel Base',
    caption: 'Distance between front and rear axles (inches).',
    type: 'number',
    default: 98.76,
    min: 50,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'length',
    label: 'Length',
    caption: 'Overall vehicle length (inches).',
    type: 'number',
    default: 174.05,
    min: 100,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'width',
    label: 'Width',
    caption: 'Overall vehicle width (inches).',
    type: 'number',
    default: 65.91,
    min: 40,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'height',
    label: 'Height',
    caption: 'Overall vehicle height (inches).',
    type: 'number',
    default: 53.73,
    min: 30,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'curb_weight',
    label: 'Curb Weight',
    caption: 'Weight of the vehicle without passengers or cargo (lbs).',
    type: 'number',
    default: 2555.57,
    min: 500,
    showDefaultHint: true,
    step: 0.01,
  },
];

// ── Engine ────────────────────────────────────────────────────
export const engineFields: FieldConfig[] = [
  {
    key: 'engine_type',
    label: 'Engine Type',
    caption: 'Valve mechanism design of the engine.',
    type: 'select',
    options: ['dohc', 'dohcv', 'l', 'ohc', 'ohcf', 'ohcv', 'rotor'],
    default: 'ohc',
    showDefaultHint: true,
  },
  {
    key: 'num_of_cylinders',
    label: 'Number of Cylinders',
    caption: 'Cylinder count in the engine block.',
    type: 'select',
    options: ['2', '3', '4', '5', '6', '8', '12'],
    default: 4,
    showDefaultHint: false,
  },
  {
    key: 'engine_size',
    label: 'Engine Size',
    caption: 'Engine displacement in cubic inches.',
    type: 'number',
    default: 126.91,
    min: 30,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'fuel_system',
    label: 'Fuel System',
    caption: 'Fuel delivery mechanism used by the engine.',
    type: 'select',
    options: ['1bbl', '2bbl', '4bbl', 'idi', 'mfi', 'mpfi', 'spdi', 'spfi'],
    default: 'mpfi',
    showDefaultHint: true,
  },
  {
    key: 'bore',
    label: 'Bore',
    caption: 'Cylinder bore diameter (inches).',
    type: 'number',
    default: 3.33,
    min: 1,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'stroke',
    label: 'Stroke',
    caption: 'Piston stroke length (inches).',
    type: 'number',
    default: 3.26,
    min: 1,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'compression_ratio',
    label: 'Compression Ratio',
    caption: 'Engine compression ratio, higher values typically mean more power.',
    type: 'number',
    default: 10.14,
    min: 1,
    showDefaultHint: true,
    step: 0.01,
  },
];

// ── Performance ───────────────────────────────────────────────
export const performanceFields: FieldConfig[] = [
  {
    key: 'horsepower',
    label: 'Horsepower',
    caption: 'Engine output power (HP).',
    type: 'number',
    default: 104.26,
    min: 10,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'peak_rpm',
    label: 'Peak RPM',
    caption: 'Engine speed at which peak horsepower is achieved.',
    type: 'number',
    default: 5125.37,
    min: 1000,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'city_L_100km',
    label: 'City Fuel Consumption',
    caption: 'Fuel consumption in city driving (L / 100 km).',
    type: 'number',
    default: 9.95,
    min: 1,
    showDefaultHint: true,
    step: 0.01,
  },
  {
    key: 'highway_mpg',
    label: 'Highway MPG',
    caption: 'Fuel efficiency on highways (miles per gallon).',
    type: 'number',
    default: 30.75,
    min: 1,
    showDefaultHint: true,
    step: 0.01,
  },
];

/** All groups for ordered rendering */
export const fieldGroups = [
  { title: 'Vehicle Identity', description: 'Basic vehicle classification and configuration', fields: vehicleIdentityFields },
  { title: 'Risk & Insurance', description: 'Risk assessment and insurance metrics', fields: riskFields },
  { title: 'Dimensions', description: 'Physical measurements of the vehicle', fields: dimensionFields },
  { title: 'Engine Specifications', description: 'Internal engine configuration and characteristics', fields: engineFields },
  { title: 'Performance & Economy', description: 'Power output and fuel consumption metrics', fields: performanceFields },
];

/** Build default form values from all field configs */
export function getDefaultValues(): Record<string, string | number> {
  const defaults: Record<string, string | number> = {};
  for (const group of fieldGroups) {
    for (const field of group.fields) {
      defaults[field.key] = field.default;
    }
  }
  return defaults;
}
