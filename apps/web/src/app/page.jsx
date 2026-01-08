"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
  TrendingUp,
  Calendar,
  Heart,
  Brain,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check system preference and local storage
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
    fetchWeekData();
  }, []);

  const fetchWeekData = async () => {
    try {
      const response = await fetch("/api/check-ins");
      if (!response.ok) throw new Error("Failed to fetch check-ins");
      const data = await response.json();

      // Get last 7 days
      const last7Days = data.slice(-7);
      setWeekData(last7Days);
    } catch (error) {
      console.error("Error fetching week data:", error);
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

  const getMoodEmoji = (mood) => {
    const moodMap = {
      angry: "😠",
      sad: "😢",
      anxious: "😰",
      neutral: "😐",
      content: "😊",
      happy: "😊",
      joyful: "😍",
    };
    return moodMap[mood] || "😐";
  };

  const getDayName = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[new Date(date).getDay()];
  };

  const getStateColor = (state) => {
    if (!state) return "text-gray-500 dark:text-gray-400";
    if (state === "Normal") return "text-green-600 dark:text-green-400";
    if (state === "Mild Stress") return "text-yellow-600 dark:text-yellow-400";
    if (state === "Moderate Stress")
      return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen transition-colors duration-200 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-b from-[#E3F2FD] via-[#E1BEE7] to-[#C8E6C9] dark:from-[#1a237e] dark:via-[#4a148c] dark:to-[#1b5e20] overflow-hidden transition-colors duration-200">
        {/* Subtle overlay pattern */}
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)`,
          }}
        />

        {/* Navigation */}
        <nav className="relative z-10 pt-8 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between bg-white/20 dark:bg-gray-800/30 backdrop-blur-md rounded-full px-8 py-3 border border-white/30 dark:border-gray-700/50 transition-colors duration-200">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Heart size={18} className="text-white" fill="white" />
                </div>
                <span className="font-bold text-gray-800 dark:text-white">
                  MindWell
                </span>
              </div>

              {/* Nav Links */}
              <div className="flex items-center space-x-8">
                <a
                  href="/"
                  className="text-gray-800 dark:text-white font-medium text-sm relative"
                >
                  Home
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 dark:bg-white rounded-full"></div>
                </a>
                <a
                  href="/check-in"
                  className="text-gray-700 dark:text-gray-300 font-medium text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Daily Check-in
                </a>
                <a
                  href="/insights"
                  className="text-gray-700 dark:text-gray-300 font-medium text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Insights
                </a>
                <a
                  href="/resources"
                  className="text-gray-700 dark:text-gray-300 font-medium text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Resources
                </a>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-300" />
                ) : (
                  <Moon size={20} className="text-gray-700" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden bg-white/20 dark:bg-gray-800/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/30 dark:border-gray-700/50 flex items-center justify-between transition-colors duration-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Heart size={16} className="text-white" fill="white" />
                </div>
                <span className="font-bold text-gray-800 dark:text-white">
                  MindWell
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  {darkMode ? (
                    <Sun size={18} className="text-yellow-300" />
                  ) : (
                    <Moon size={18} className="text-gray-700" />
                  )}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 hover:bg-white/30 dark:hover:bg-gray-700/50 rounded-md transition-colors duration-200"
                >
                  {mobileMenuOpen ? (
                    <X size={20} className="text-gray-800 dark:text-white" />
                  ) : (
                    <Menu size={20} className="text-gray-800 dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 bg-white/30 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 dark:border-gray-700/50 transition-colors duration-200">
                <div className="space-y-4">
                  <a
                    href="/"
                    className="block text-gray-800 dark:text-white font-medium text-sm"
                  >
                    Home
                  </a>
                  <a
                    href="/check-in"
                    className="block text-gray-700 dark:text-gray-300 font-medium text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Daily Check-in
                  </a>
                  <a
                    href="/insights"
                    className="block text-gray-700 dark:text-gray-300 font-medium text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Insights
                  </a>
                  <a
                    href="/resources"
                    className="block text-gray-700 dark:text-gray-300 font-medium text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Resources
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center pt-12 md:pt-20 px-6">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl mx-auto mb-6 transition-colors duration-200">
            Your Mental Health
            <br />
            Companion
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed transition-colors duration-200">
            Track your mood, understand patterns, and get personalized support
            for your mental wellbeing journey
          </p>

          {/* CTA Button */}
          <a
            href="/check-in"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-base hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 mb-12"
          >
            Start Today's Check-in
          </a>

          {/* Dashboard Preview Card */}
          <div className="relative mt-8 w-full max-w-4xl">
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-3xl p-6 md:p-10 shadow-2xl border border-white/50 dark:border-gray-700/50 transition-colors duration-200">
              {/* Greeting */}
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base transition-colors duration-200">
                  Welcome back,
                </p>
                <p className="text-gray-900 dark:text-white font-bold text-xl md:text-2xl transition-colors duration-200">
                  Student
                </p>
              </div>

              {/* Weekly Mood Tracker */}
              <div className="mb-8">
                <h3 className="text-gray-800 dark:text-white font-semibold mb-4 text-left transition-colors duration-200">
                  Your Week at a Glance
                </h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="flex justify-between items-end">
                    {weekData.map((day, index) => (
                      <div key={index} className="text-center flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-2 flex items-center justify-center text-2xl mx-auto transition-colors duration-200">
                          {getMoodEmoji(day.mood)}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                          {getDayName(day.created_at)}
                        </span>
                      </div>
                    ))}
                    {weekData.length < 7 &&
                      [...Array(7 - weekData.length)].map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="text-center flex-1"
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-2 flex items-center justify-center text-2xl mx-auto transition-colors duration-200">
                            ❓
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            {getDayName(
                              new Date(
                                Date.now() -
                                  (7 - weekData.length - index) *
                                    24 *
                                    60 *
                                    60 *
                                    1000,
                              ),
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-5 transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current State
                    </span>
                  </div>
                  <p
                    className={`text-xl font-bold ${getStateColor(weekData[weekData.length - 1]?.analysis_state)}`}
                  >
                    {weekData[weekData.length - 1]?.analysis_state ||
                      "No data yet"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-5 transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar
                      size={20}
                      className="text-purple-600 dark:text-purple-400"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Check-ins
                    </span>
                  </div>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {weekData.length} this week
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-5 transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confidence
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {weekData[weekData.length - 1]?.analysis_confidence || 0}%
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/check-in"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-2xl p-5 hover:shadow-lg transition-all duration-200 text-left block"
                >
                  <h4 className="font-semibold mb-1">Daily Check-in</h4>
                  <p className="text-sm text-blue-100">
                    How are you feeling today?
                  </p>
                </a>

                <a
                  href="/resources"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white rounded-2xl p-5 hover:shadow-lg transition-all duration-200 text-left block"
                >
                  <h4 className="font-semibold mb-1">Wellness Resources</h4>
                  <p className="text-sm text-purple-100">
                    Tips and exercises for you
                  </p>
                </a>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center transition-colors duration-200">
                  ⚠️ This app does not replace professional mental health care.
                  If you're in crisis, please contact a counselor or trusted
                  person.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
