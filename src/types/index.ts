// Team types
export interface Team {
  teamNumber: number;
  teamName: string;
  location?: string;
  robotName?: string;
  imageUrl?: string;
}

// Robot/Pit Scouting types
export interface RobotInfo {
  teamNumber: number;
  drivetrainType: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  canClimb: boolean;
  shootingMechanism: string;
  intakeMechanism: string;
  autoCapabilities: string[];
  strengths: string[];
  weaknesses: string[];
  notes: string;
  imageUrls?: string[];
}

// Match Scouting types
export interface MatchScoutingData {
  id?: string;
  matchNumber: number;
  teamNumber: number;
  alliance: 'red' | 'blue';
  scoutName: string;
  timestamp: number;
  
  // Auto period
  autoLeaveStartingZone: boolean;
  autoGamePieceScored: number;
  autoHighGoals: number;
  autoLowGoals: number;
  
  // Teleop period
  teleopGamePieceScored: number;
  teleopHighGoals: number;
  teleopLowGoals: number;
  
  // Endgame
  endgameClimb: boolean;
  climbLevel: number;
  defenseRating: number;
  
  // General
  robotBroke: boolean;
  notes: string;
}

// Match types
export interface Match {
  matchNumber: number;
  matchType: 'practice' | 'qualification' | 'playoff';
  red1: number;
  red2: number;
  red3: number;
  blue1: number;
  blue2: number;
  blue3: number;
  redScore?: number;
  blueScore?: number;
  winner?: 'red' | 'blue' | 'tie';
  time?: string;
}

// Team Performance Metrics
export interface TeamPerformance {
  teamNumber: number;
  avgAutoScore: number;
  avgTeleopScore: number;
  avgEndgameScore: number;
  avgTotalScore: number;
  consistencyRating: number;
  defenseRating: number;
  climbSuccessRate: number;
  matchesPlayed: number;
  opr: number; // Offensive Power Rating
  dpr: number; // Defensive Power Rating
  ccwm: number; // Calculated Contribution to Win Margin
}

// Alliance Selection Recommendation
export interface AllianceRecommendation {
  teamNumber: number;
  overallRating: number;
  compatibilityScore: number;
  strengthsMatch: string[];
  weaknessesComplement: string[];
  recommendation: 'high' | 'medium' | 'low';
  notes: string;
}