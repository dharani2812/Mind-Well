"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Moon, Sun, Loader2 } from "lucide-react";

export default function CheckInPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mood, setMood] = useState("");
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState("");
  const [focusLevel, setFocusLevel] = useState("");
  const [journalText, setJournalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  const moods = [
    { value: "angry", emoji: "😠", label: "Angry" },
    { value: "sad", emoji: "😢", label: "Sad" },
    { value: "anxious", emoji: "😰", label: "Anxious" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "content", emoji: "😊", label: "Content" },
    { value: "happy", emoji: "😊", label: "Happy" },
    { value: "joyful", emoji: "😍", label: "Joyful" },
  ];

  const sleepOptions = [
    { value: "poor", label: "Poor" },
    { value: "fair", label: "Fair" },
    { value: "good", label: "Good" },
    { value: "excellent", label: "Excellent" },
  ];

  const focusOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mood || !sleepQuality || !focusLevel) {
      setError("Please complete all required fields");
      return;
    }

    setLoading(true);
    setAnalyzing(true);
    setError(null);

    try {
      // First, analyze the mental state
      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          stressLevel,
          sleepQuality,
          focusLevel,
          journalText,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze mental state");
      }

      const analysis = await analysisResponse.json();
      setAnalyzing(false);

      // Then save the check-in with analysis
      const saveResponse = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          stress_level: stressLevel,
          sleep_quality: sleepQuality,
          focus_level: focusLevel,
          journal_text: journalText,
          analysis_state: analysis.state,
          analysis_confidence: analysis.confidence,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save check-in");
      }

      setResult(analysis);
    } catch (err) {
      console.error("Error submitting check-in:", err);
      setError("Something went wrong. Please try again.");
      setAnalyzing(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMood("");
    setStressLevel(5);
    setSleepQuality("");
    setFocusLevel("");
    setJournalText("");
    setResult(null);
    setError(null);
  };

  const getStateColor = (state) => {
    if (state === "Normal")
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
    if (state === "Mild Stress")
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
    if (state === "Moderate Stress")
      return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] via-[#E1BEE7] to-[#C8E6C9] dark:from-[#1a237e] dark:via-[#4a148c] dark:to-[#1b5e20] transition-colors duration-200 p-6">
        <div className="max-w-2xl mx-auto pt-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <a
              href="/"
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={24} />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-300" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-gray-700/50">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Check-in Complete! ✓
            </h2>

            <div className="space-y-6">
              {/* Analysis Result */}
              <div className={`rounded-2xl p-6 ${getStateColor(result.state)}`}>
                <h3 className="font-semibold text-lg mb-2">
                  Your Current State
                </h3>
                <p className="text-2xl font-bold mb-1">{result.state}</p>
                <p className="text-sm opacity-80">
                  Confidence: {result.confidence}%
                </p>
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Understanding Your Results
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Personalized Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="text-gray-700 dark:text-gray-300 flex items-start"
                      >
                        <span className="text-purple-600 dark:text-purple-400 mr-2">
                          •
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Crisis Support */}
              {(result.state === "High Stress" ||
                result.state === "Moderate Stress") && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                    Need Support?
                  </h3>
                  <p className="text-red-700 dark:text-red-400 text-sm mb-3">
                    We noticed you might be experiencing significant stress.
                    Consider reaching out to:
                  </p>
                  <ul className="text-red-700 dark:text-red-400 text-sm space-y-1">
                    <li>• Your campus counseling center</li>
                    <li>• A trusted friend or family member</li>
                    <li>• Mental health hotline: 988 (US)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={resetForm}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                New Check-in
              </button>
              <a
                href="/insights"
                className="flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all text-center"
              >
                View Insights
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] via-[#E1BEE7] to-[#C8E6C9] dark:from-[#1a237e] dark:via-[#4a148c] dark:to-[#1b5e20] transition-colors duration-200 p-6">
      <div className="max-w-2xl mx-auto pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a
            href="/"
            className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={24} />
          </a>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Check-in
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-gray-700/50"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Mood Selection */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-white font-semibold mb-4">
              How are you feeling today? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                    mood === m.value
                      ? "bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-105"
                      : "bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80"
                  }`}
                >
                  <span className="text-3xl mb-1">{m.emoji}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level Slider */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-white font-semibold mb-2">
              Stress Level:{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {stressLevel}/10
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-white font-semibold mb-4">
              Sleep Quality <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sleepOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSleepQuality(option.value)}
                  className={`p-4 rounded-2xl font-medium transition-all ${
                    sleepQuality === option.value
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500"
                      : "bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Level */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-white font-semibold mb-4">
              Focus Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {focusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFocusLevel(option.value)}
                  className={`p-4 rounded-2xl font-medium transition-all ${
                    focusLevel === option.value
                      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 ring-2 ring-green-500"
                      : "bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Entry */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-white font-semibold mb-2">
              Journal (Optional)
            </label>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="How are you feeling? Any thoughts you'd like to share?"
              rows="4"
              className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing your wellbeing...
              </>
            ) : loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Submit Check-in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
