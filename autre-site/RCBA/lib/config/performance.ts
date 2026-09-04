export const PERFORMANCE_CONFIG = {
  THRESHOLDS: {
    SDI: {
      CRITICAL: 60,
      PEAK: 90,
    },
    FATIGUE: {
      WARNING: 3.5,
      CRITICAL: 4.5,
    },
    INTENSITY: {
      WARNING: 8,
      CRITICAL: 9,
    },
    RETENTION: {
      STRESS_MAX: 2,
      ENERGY_MIN: 2,
      MIN_LOGS: 3,
      DAYS_LOOKBACK: 14,
    },
    PAIN: {
      CRITICAL_LEVEL: 4,
    }
  },
  LOOKBACK: {
    ALERTS_DAYS: 7,
    TRENDS_DAYS: 14,
  }
};
