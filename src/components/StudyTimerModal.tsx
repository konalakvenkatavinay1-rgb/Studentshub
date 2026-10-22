import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, RotateCcw, X, Clock } from 'lucide-react';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (subject: string, elapsedMinutes: number, notes?: string) => void;
  subjects: string[];
}

interface SavedTimerState {
  initialSeconds: number;
  remainingSeconds: number;
  elapsedSeconds: number;
  isRunning: boolean;
  lastTickTimestamp: number;
  selectedSubject: string;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  onSaveSession,
  subjects
}) => {
  // Preset options (in minutes)
  const presets = [15, 30, 45, 60, 90, 120];

  const [selectedMinutes, setSelectedMinutes] = useState<number>(45);
  const [customInput, setCustomInput] = useState<string>('');
  const [subject, setSubject] = useState<string>(subjects[0] || 'ECE Core Subject');
  const [notes, setNotes] = useState<string>('');

  // Timer run states
  const [remainingSeconds, setRemainingSeconds] = useState<number>(45 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Review & Save dialog
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [savedActualMinutes, setSavedActualMinutes] = useState<number>(0);

  const STORAGE_KEY = 'slh_active_study_timer';
  const intervalRef = useRef<number | null>(null);

  // Synchronize default subject if subjects array changes
  useEffect(() => {
    if (subjects.length > 0 && !subject) {
      setSubject(subjects[0]);
    }
  }, [subjects, subject]);

  // Restore interrupted timer session from localStorage on mount/open
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedTimerState = JSON.parse(saved);
        if (parsed && typeof parsed.remainingSeconds === 'number' && parsed.elapsedSeconds > 0) {
          // If was running, calculate elapsed time during interruption safely
          let additionalElapsed = 0;
          if (parsed.isRunning && parsed.lastTickTimestamp) {
            const now = Date.now();
            const deltaSec = Math.floor((now - parsed.lastTickTimestamp) / 1000);
            // Cap at remaining seconds to prevent overshoot
            additionalElapsed = Math.min(Math.max(0, deltaSec), parsed.remainingSeconds);
          }

          const newElapsed = parsed.elapsedSeconds + additionalElapsed;
          const newRemaining = Math.max(0, parsed.remainingSeconds - additionalElapsed);

          setElapsedSeconds(newElapsed);
          setRemainingSeconds(newRemaining);
          setHasStarted(true);
          // Always pause on fresh reopen so user actively resumes
          setIsRunning(false);
          if (parsed.selectedSubject) setSubject(parsed.selectedSubject);

          if (newRemaining === 0) {
            setIsCompleted(true);
          }
        }
      }
    } catch {
      // Ignore corrupted timer state
    }
  }, [isOpen]);

  // Persist timer state to localStorage whenever it ticks or state updates
  useEffect(() => {
    if (hasStarted && (elapsedSeconds > 0 || isRunning)) {
      const state: SavedTimerState = {
        initialSeconds: selectedMinutes * 60,
        remainingSeconds,
        elapsedSeconds,
        isRunning,
        lastTickTimestamp: Date.now(),
        selectedSubject: subject
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [hasStarted, elapsedSeconds, remainingSeconds, isRunning, selectedMinutes, subject]);

  // Interval execution for the timer
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer naturally reached 00:00:00
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });

        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, remainingSeconds]);

  // Handle Preset or Custom Duration selection
  const handleSelectPreset = (mins: number) => {
    if (hasStarted && isRunning) {
      if (!window.confirm('A study timer is currently active. Reset and change duration?')) {
        return;
      }
    }
    setSelectedMinutes(mins);
    setCustomInput('');
    setRemainingSeconds(mins * 60);
    setElapsedSeconds(0);
    setHasStarted(false);
    setIsRunning(false);
    setIsCompleted(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0 && val <= 720) {
      handleSelectPreset(val);
    }
  };

  // Timer controls
  const handleStart = () => {
    setHasStarted(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  // Finish session: records ONLY the actual elapsed minutes
  const handleFinish = () => {
    setIsRunning(false);
    // Convert actual elapsed seconds to minutes (round to 1 decimal or floor with min 1 if >30s)
    const actualMins = elapsedSeconds >= 30 ? Math.max(1, Math.round(elapsedSeconds / 60)) : 0;
    setSavedActualMinutes(actualMins);
    setShowSaveDialog(true);
  };

  // Handle Close / Cancel request
  const handleRequestClose = () => {
    if (hasStarted && !isCompleted && elapsedSeconds > 10 && !showSaveDialog) {
      if (window.confirm('You have an ongoing study session. Discard this session without saving?')) {
        setIsRunning(false);
        setHasStarted(false);
        setElapsedSeconds(0);
        localStorage.removeItem(STORAGE_KEY);
        onClose();
      }
    } else {
      setIsRunning(false);
      onClose();
    }
  };

  // Reset timer
  const handleReset = () => {
    if (hasStarted && isRunning) {
      if (!window.confirm('Are you sure you want to reset this timer?')) return;
    }
    setIsRunning(false);
    setHasStarted(false);
    setElapsedSeconds(0);
    setRemainingSeconds(selectedMinutes * 60);
    setIsCompleted(false);
    setShowSaveDialog(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Final save study session
  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (savedActualMinutes > 0) {
      onSaveSession(subject, savedActualMinutes, notes.trim() || undefined);
    }
    // Clean up
    localStorage.removeItem(STORAGE_KEY);
    setHasStarted(false);
    setIsRunning(false);
    setElapsedSeconds(0);
    setShowSaveDialog(false);
    setIsCompleted(false);
    setNotes('');
    onClose();
  };

  // Format HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Format MM:SS for elapsed
  const formatElapsed = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#151945] rounded-3xl p-5 sm:p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-scaleIn relative overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Custom ECE Study Timer</h3>
              <p className="text-[11px] text-slate-400">
                Focused study counts toward your 60-min daily streak goal.
              </p>
            </div>
          </div>
          <button
            onClick={handleRequestClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Review & Save Session Dialog */}
        {showSaveDialog ? (
          <form onSubmit={handleConfirmSave} className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Session Completed
              </span>
              <div className="text-3xl font-black text-indigo-950 dark:text-indigo-100">
                {savedActualMinutes} <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Minutes</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {savedActualMinutes > 0
                  ? `Only actual elapsed study time (${formatElapsed(elapsedSeconds)}) is credited toward your daily streak.`
                  : 'Study time was under 30 seconds and will not affect streak stats.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Subject / Topic Studied</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                {subjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
                <option value="General ECE Revision">General ECE Revision</option>
                <option value="GATE PYQ Practice">GATE PYQ Practice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Study Notes & Summary (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key concepts reviewed, formulas practiced, problems solved..."
                rows={3}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Back to Timer
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition active:scale-95"
              >
                Save & Update Streak 🔥
              </button>
            </div>
          </form>
        ) : (
          /* View 2: Main Active Timer */
          <div className="space-y-6">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Target Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={hasStarted && isRunning}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-75"
              >
                {subjects.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
                <option value="General ECE Revision">General ECE Revision</option>
                <option value="GATE PYQ Practice">GATE PYQ Practice</option>
              </select>
            </div>

            {/* Duration Presets & Custom Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Select Duration</label>
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {presets.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectPreset(mins)}
                    disabled={hasStarted && isRunning}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      selectedMinutes === mins && !customInput
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    } disabled:opacity-60`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Custom input option */}
              <form onSubmit={handleCustomSubmit} className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max="720"
                  placeholder="Or enter custom minutes (e.g. 25, 50, 75)..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={hasStarted && isRunning}
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={(hasStarted && isRunning) || !customInput}
                  className="px-3.5 py-1.5 bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition"
                >
                  Set
                </button>
              </form>
            </div>

            {/* Big Countdown Display */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white text-center shadow-inner relative overflow-hidden">
              <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-300 mb-1">
                {isCompleted ? 'Target Duration Reached!' : isRunning ? 'Countdown Running' : hasStarted ? 'Timer Paused' : 'Ready to Focus'}
              </div>
              <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white my-1 select-none">
                {formatTime(remainingSeconds)}
              </div>
              <div className="flex items-center justify-center space-x-3 text-xs text-indigo-200/90 mt-2">
                <span>Selected: {selectedMinutes}m</span>
                <span>•</span>
                <span className="font-semibold text-emerald-300">
                  Actual Elapsed: {formatElapsed(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Timer Control Buttons */}
            <div className="flex items-center justify-center space-x-3 pt-1">
              {!hasStarted ? (
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl transition shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Study Session</span>
                </button>
              ) : (
                <>
                  {isRunning ? (
                    <button
                      type="button"
                      onClick={handlePause}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-amber-500/25 flex items-center justify-center space-x-1.5"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResume}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-emerald-500/25 flex items-center justify-center space-x-1.5"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Resume</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFinish}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Finish & Log</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
