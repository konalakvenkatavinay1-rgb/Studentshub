/**
 * Date and streak calculation utilities for Student Learning Hub.
 * Uses local timezone calendar dates (YYYY-MM-DD) to ensure accurate day transitions.
 * Qualifying study streak rule: Minimum 60 minutes of actual recorded study time per day.
 */

import type { StudyActivityRecord } from '../types';

export const DAILY_STREAK_GOAL_MINUTES = 60;

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  activeToday: boolean;
  todayMinutes: number;
  remainingMinutesToday: number;
  lastActiveDate: string | null;
}

export interface DayActivityStatus {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  dayNumber: number;
  active: boolean; // reached 60 mins
  isToday: boolean;
  minutes: number;
}

/**
 * Returns YYYY-MM-DD for a given date in local time.
 */
export const formatLocalDate = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates calendar day difference between dateStr1 and dateStr2 (d1 - d2 in days).
 */
export const getDaysDiff = (dateStr1: string, dateStr2: string): number => {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
};

/**
 * Aggregates actual study minutes per local calendar day from study activity records.
 * Multiple completed sessions on the same local calendar day are combined.
 */
export const getDailyStudyMinutesMap = (
  activities: StudyActivityRecord[] = []
): Record<string, number> => {
  const map: Record<string, number> = {};

  for (const act of activities) {
    if (!act || !act.date) continue;
    // Count durationMinutes if provided; fallback to 0 if not a timed study session
    const mins = typeof act.durationMinutes === 'number' && act.durationMinutes > 0
      ? act.durationMinutes
      : 0;

    map[act.date] = (map[act.date] || 0) + mins;
  }

  return map;
};

/**
 * Calculates current streak and best streak based on days with >= DAILY_STREAK_GOAL_MINUTES (60 min).
 * A streak is active if the most recent qualifying day was today OR yesterday.
 */
export const calculateStudyStreakStats = (
  activities: StudyActivityRecord[] = [],
  thresholdMinutes = DAILY_STREAK_GOAL_MINUTES
): StreakStats => {
  const todayStr = formatLocalDate(new Date());
  const dailyMap = getDailyStudyMinutesMap(activities);

  const todayMinutes = dailyMap[todayStr] || 0;
  const remainingMinutesToday = Math.max(0, thresholdMinutes - todayMinutes);
  const activeToday = todayMinutes >= thresholdMinutes;

  // Filter for days that strictly met or exceeded the threshold
  const qualifyingDates = Object.keys(dailyMap)
    .filter(d => (dailyMap[d] || 0) >= thresholdMinutes)
    .sort();

  if (qualifyingDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      activeToday,
      todayMinutes,
      remainingMinutesToday,
      lastActiveDate: null
    };
  }

  const lastActiveDate = qualifyingDates[qualifyingDates.length - 1];

  // 1. Calculate best streak throughout the entire qualifying history
  let maxStreak = 1;
  let runningStreak = 1;

  for (let i = 1; i < qualifyingDates.length; i++) {
    const diff = getDaysDiff(qualifyingDates[i], qualifyingDates[i - 1]);
    if (diff === 1) {
      runningStreak += 1;
      if (runningStreak > maxStreak) {
        maxStreak = runningStreak;
      }
    } else if (diff > 1) {
      runningStreak = 1;
    }
  }

  // 2. Calculate current streak
  // Streak is considered active if the latest qualifying day was today (0) or yesterday (1).
  const diffFromToday = getDaysDiff(todayStr, lastActiveDate);

  let currentStreak = 0;
  if (diffFromToday === 0 || diffFromToday === 1) {
    currentStreak = 1;
    for (let i = qualifyingDates.length - 1; i > 0; i--) {
      const diff = getDaysDiff(qualifyingDates[i], qualifyingDates[i - 1]);
      if (diff === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  } else {
    // Last qualifying day was 2 or more days ago: streak broken
    currentStreak = 0;
  }

  const bestStreak = Math.max(maxStreak, currentStreak);

  return {
    currentStreak,
    bestStreak,
    activeToday,
    todayMinutes,
    remainingMinutesToday,
    lastActiveDate
  };
};

/**
 * Returns a 7-day activity array representing the last 7 calendar days up to today.
 * Displays minutes accumulated and whether the day met the 60-minute streak goal.
 */
export const getLast7DaysActivity = (
  activities: StudyActivityRecord[] = [],
  thresholdMinutes = DAILY_STREAK_GOAL_MINUTES
): DayActivityStatus[] => {
  const dailyMap = getDailyStudyMinutesMap(activities);
  const today = new Date();
  const days: DayActivityStatus[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = formatLocalDate(d);
    const mins = dailyMap[dateStr] || 0;

    days.push({
      date: dateStr,
      dayLabel: dayLabels[d.getDay()],
      dayNumber: d.getDate(),
      active: mins >= thresholdMinutes,
      isToday: i === 0,
      minutes: mins
    });
  }

  return days;
};
