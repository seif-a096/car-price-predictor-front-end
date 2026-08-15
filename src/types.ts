/** Shape of the request body sent to the prediction API */
export interface PredictionRequest {
  symboling: number;
  normalized_losses: number;
  wheel_base: number;
  length: number;
  width: number;
  height: number;
  curb_weight: number;
  engine_size: number;
  bore: number;
  stroke: number;
  compression_ratio: number;
  horsepower: number;
  peak_rpm: number;
  city_L_100km: number;
  highway_mpg: number;
  num_of_doors: number;
  num_of_cylinders: number;
  make: string;
  fuel_type: string;
  aspiration: string;
  body_style: string;
  drive_wheels: string;
  engine_location: string;
  engine_type: string;
  fuel_system: string;
}

/** Shape of the API response */
export interface PredictionResponse {
  predicted_price: number;
}

/** Describes one field in the form */
export interface FieldConfig {
  key: keyof PredictionRequest;
  label: string;
  caption: string;
  type: 'number' | 'select';
  options?: string[];
  default: number | string;
  /** If true, show "leave default if unsure" hint */
  showDefaultHint: boolean;
  step?: number;
  min?: number;
  max?: number;
}
