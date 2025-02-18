export type ChallengeType = 'plumbing' | 'construction' | 'electrical' | 'roofing';

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  imageUrl: string;
  options: {
    x: number;
    y: number;
    isCorrect: boolean;
    label?: string;
  }[];
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
}
