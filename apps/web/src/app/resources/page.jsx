"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Heart,
  Brain,
  Coffee,
  BookOpen,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function ResourcesPage() {
  const [darkMode, setDarkMode] = useState(false);

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

  const breathingExercises = [
    {
      title: "4-7-8 Breathing",
      description:
        "Breathe in for 4 counts, hold for 7, exhale for 8. Helps reduce anxiety.",
      duration: "2-5 minutes",
      icon: <Heart size={24} className="text-blue-600 dark:text-blue-400" />,
    },
    {
      title: "Box Breathing",
      description:
        "Breathe in for 4, hold for 4, out for 4, hold for 4. Great for focus.",
      duration: "3-5 minutes",
      icon: (
        <Brain size={24} className="text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "Deep Belly Breathing",
      description:
        "Slow, deep breaths into your belly. Perfect for relaxation.",
      duration: "5-10 minutes",
      icon: <Coffee size={24} className="text-green-600 dark:text-green-400" />,
    },
  ];

  const studyTips = [
    {
      title: "Pomodoro Technique",
      description:
        "Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.",
      category: "Productivity",
    },
    {
      title: "Active Recall",
      description:
        "Test yourself on material instead of just re-reading. Create flashcards or practice questions.",
      category: "Learning",
    },
    {
      title: "Study Environment",
      description:
        "Find a quiet, well-lit space. Keep your phone away and minimize distractions.",
      category: "Environment",
    },
    {
      title: "Break It Down",
      description:
        "Divide large tasks into smaller, manageable chunks. Celebrate small wins along the way.",
      category: "Planning",
    },
    {
      title: "Sleep Well",
      description:
        "Aim for 7-9 hours of sleep. Your brain consolidates learning during sleep.",
      category: "Health",
    },
    {
      title: "Stay Hydrated",
      description:
        "Keep water nearby. Dehydration can affect concentration and cognitive performance.",
      category: "Health",
    },
  ];

  const mentalHealthResources = [
    {
      title: "988 Suicide & Crisis Lifeline",
      description: "24/7 free and confidential support",
      contact: "Call or text 988",
      icon: <Phone size={20} className="text-red-600 dark:text-red-400" />,
    },
    {
      title: "Crisis Text Line",
      description: "Text with a trained crisis counselor",
      contact: "Text HOME to 741741",
      icon: (
        <MessageCircle size={20} className="text-blue-600 dark:text-blue-400" />
      ),
    },
    {
      title: "Campus Counseling Center",
      description:
        "Your school likely offers free counseling services for students",
      contact: "Check your university website",
      icon: (
        <BookOpen size={20} className="text-green-600 dark:text-green-400" />
      ),
    },
  ];

  const selfCareTips = [
    "Take regular breaks from studying and screens",
    "Exercise for at least 30 minutes, 3-4 times per week",
    "Maintain a consistent sleep schedule",
    "Eat balanced, nutritious meals",
    "Stay connected with friends and family",
    "Practice gratitude - write down 3 things you're grateful for each day",
    "Limit caffeine and alcohol consumption",
    "Set boundaries - it's okay to say no",
    "Spend time outdoors in nature when possible",
    "Engage in hobbies and activities you enjoy",
  ];

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
            Wellness Resources
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

        <div className="space-y-8">
          {/* Crisis Support - Most Important */}
          <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-red-200 dark:border-red-800">
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-4">
              🆘 Need Immediate Help?
            </h2>
            <div className="space-y-4">
              {mentalHealthResources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className="mt-1">{resource.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {resource.description}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {resource.contact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-red-700 dark:text-red-400 mt-4 italic">
              Remember: Seeking help is a sign of strength, not weakness. You
              don't have to face challenges alone.
            </p>
          </div>

          {/* Breathing Exercises */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🌬️ Breathing Exercises
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {breathingExercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="mb-4">{exercise.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {exercise.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {exercise.description}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    ⏱️ {exercise.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📚 Study Tips for Success
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyTips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/60 dark:bg-gray-700/60 rounded-2xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {tip.title}
                    </h3>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                      {tip.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Care Checklist */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              💚 Self-Care Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selfCareTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-green-500 dark:border-green-400 flex-shrink-0 mt-0.5"></div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              <strong>Disclaimer:</strong> These resources are for informational
              purposes and do not replace professional medical advice,
              diagnosis, or treatment. If you're experiencing a mental health
              emergency, please contact emergency services or a mental health
              crisis line immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
