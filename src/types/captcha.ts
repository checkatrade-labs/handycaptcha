export type ChallengeType = string;

export type RegionShape = {
  name: 'polygon' | 'rect' | 'ellipse';
  all_points_x?: number[];
  all_points_y?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
};

export interface ChallengeRegion {
  shape: RegionShape;
  isCorrect: boolean;
  label: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  regions: ChallengeRegion[];
}

export interface CaptchaResponse {
  success: boolean;
  score: number;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

export interface CaptchaProps {
  siteKey: string;
  theme?: 'light' | 'dark';
  onVerify?: (response: CaptchaResponse) => void;
  onError?: (error: Error) => void;
  debug?: boolean;
}
