export type PlanType = 'FREE' | 'BASIC' | 'DIAMOND';

export interface PlanLimits {
  dailyWorkouts: number;
  dailyScans: number;
  dailyMealPlans: number;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  FREE: { dailyWorkouts: 2, dailyScans: 0, dailyMealPlans: 1 },
  BASIC: { dailyWorkouts: 8, dailyScans: 1, dailyMealPlans: 3 },
  DIAMOND: { dailyWorkouts: 999, dailyScans: 999, dailyMealPlans: 999 },
};

export const FITCOIN_COSTS = {
  EXTRA_WORKOUT: 50,
  VISION_SCAN: 200,
  EXTRA_MEAL_PLAN: 30,
};