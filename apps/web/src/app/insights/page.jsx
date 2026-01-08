"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, TrendingUp, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function InsightsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week"); // 'week' or 'month'

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

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      const response = await fetch("/api/check-ins");
      if (!response.ok) throw new Error("Failed to fetch check-ins");
      const data = await response.json();
      setCheckIns(data);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // Process data for charts
  const getDisplayData = () => {
    if (timeframe === "week") {
      return checkIns.slice(-7);
    }
    return checkIns.slice(-30);
  };

  const chartData = getDisplayData().map((item) => {
    const date = new Date(item.created_at);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      stress: item.stress_level,
      mood: getMoodScore(item.mood),
      sleep: getSleepScore(item.sleep_quality),
      focus: getFocusScore(item.focus_level),
    };
  });

  function getMoodScore(mood) {
    const scores = {
      angry: 1,
      sad: 2,
      anxious: 3,
      neutral: 5,
      content: 7,
      happy: 8,
      joyful: 10,
    };
    return scores[mood] || 5;
  }

  function getSleepScore(quality) {
    const scores = { poor: 2.5, fair: 5, good: 7.5, excellent: 10 };
    return scores[quality] || 5;
  }

  function getFocusScore(level) {
    const scores = { low: 3, medium: 6, high: 9 };
    return scores[level] || 6;
  }

  // Calculate averages
  const getAverages = () => {
    const data = getDisplayData();
    if (data.length === 0) return { stress: 0, mood: 0, sleep: 0, focus: 0 };

    const totals = data.reduce(
      (acc, item) => ({
        stress: acc.stress + item.stress_level,
        mood: acc.mood + getMoodScore(item.mood),
        sleep: acc.sleep + getSleepScore(item.sleep_quality),
        focus: acc.focus + getFocusScore(item.focus_level),
      }),
      { stress: 0, mood: 0, sleep: 0, focus: 0 },
    );

    return {
      stress: (totals.stress / data.length).toFixed(1),
      mood: (totals.mood / data.length).toFixed(1),
      sleep: (totals.sleep / data.length).toFixed(1),
      focus: (totals.focus / data.length).toFixed(1),
    };
  };

  const averages = getAverages();

  // Get state distribution
  const getStateDistribution = () => {
    const data = getDisplayData();
    const distribution = {
      Normal: 0,
      "Mild Stress": 0,
      "Moderate Stress": 0,
      "High Stress": 0,
    };

    data.forEach((item) => {
      if (item.analysis_state) {
        distribution[item.analysis_state] =
          (distribution[item.analysis_state] || 0) + 1;
      }
    });

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const stateDistribution = getStateDistribution();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] via-[#E1BEE7] to-[#C8E6C9] dark:from-[#1a237e] dark:via-[#4a148c] dark:to-[#1b5e20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] via-[#E1BEE7] to-[#C8E6C9] dark:from-[#1a237e] dark:via-[#4a148c] dark:to-[#1b5e20] transition-colors duration-200 p-6 pb-20">
      <div className="max-w-6xl mx-auto pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a
            href="/"
            className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={24} />
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Your Insights
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

        {/* Timeframe Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-full p-1 flex gap-1">
            <button
              onClick={() => setTimeframe("week")}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                timeframe === "week"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe("month")}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                timeframe === "month"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {checkIns.length === 0 ? (
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/50 dark:border-gray-700/50 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Data Yet
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Start tracking your mental wellbeing by completing your first
              check-in!
            </p>
            <a
              href="/check-in"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Start Check-in
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Average Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Avg Stress
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averages.stress}/10
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Avg Mood
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averages.mood}/10
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Avg Sleep
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averages.sleep}/10
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Avg Focus
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averages.focus}/10
                </p>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Wellbeing Trends
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      style={{ fontSize: "12px" }}
                      domain={[0, 10]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                        border: "none",
                        borderRadius: "12px",
                        color: darkMode ? "#fff" : "#000",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Stress"
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Mood"
                    />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Sleep"
                    />
                    <Line
                      type="monotone"
                      dataKey="focus"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Focus"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* State Distribution */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Mental State Distribution
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateDistribution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                        border: "none",
                        borderRadius: "12px",
                        color: darkMode ? "#fff" : "#000",
                      }}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Check-ins
              </h3>
              <div className="space-y-4">
                {checkIns.slice(0, 5).map((item, index) => {
                  const date = new Date(item.created_at);
                  return (
                    <div
                      key={item.id}
                      className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {item.mood === "angry" && "😠"}
                          {item.mood === "sad" && "😢"}
                          {item.mood === "anxious" && "😰"}
                          {item.mood === "neutral" && "😐"}
                          {item.mood === "content" && "😊"}
                          {item.mood === "happy" && "😊"}
                          {item.mood === "joyful" && "😍"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Stress: {item.stress_level}/10 •{" "}
                            {item.sleep_quality} sleep
                          </p>
                        </div>
                      </div>
                      {item.analysis_state && (
                        <div
                          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                            item.analysis_state === "Normal"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : item.analysis_state === "Mild Stress"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : item.analysis_state === "Moderate Stress"
                                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {item.analysis_state}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
