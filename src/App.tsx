import { useState } from "react";
import { Heart, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import emailjs from "@emailjs/browser";

const LoveCalculator = () => {
  const [userName, setUserName] = useState("");
  const [crushName, setCrushName] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const calculateLovePercentage = (name1: string, name2: string) => {
    const clean1 = name1.toLowerCase().replace(/\s/g, "");
    const clean2 = name2.toLowerCase().replace(/\s/g, "");

    const vowels = ["a", "e", "i", "o", "u"];

    // 1️⃣ Common letters score
    const set1 = new Set(clean1);
    const set2 = new Set(clean2);

    let commonLetters = 0;
    set1.forEach((char) => {
      if (set2.has(char)) commonLetters++;
    });

    const commonScore = (commonLetters / Math.max(set1.size, 1)) * 40;

    // 2️⃣ Vowel compatibility
    const vowelCount1 = [...clean1].filter((c) => vowels.includes(c)).length;
    const vowelCount2 = [...clean2].filter((c) => vowels.includes(c)).length;

    const vowelScore =
      (Math.min(vowelCount1, vowelCount2) /
        Math.max(vowelCount1 + vowelCount2, 1)) *
      30;

    // 3️⃣ Length similarity
    const lengthDiff = Math.abs(clean1.length - clean2.length);
    const lengthScore = Math.max(0, 20 - lengthDiff * 3);

    // 4️⃣ Deterministic hash for randomness
    const combined = clean1 + clean2;
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
      hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hashScore = Math.abs(hash % 10);

    let percentage = Math.round(
      commonScore + vowelScore + lengthScore + hashScore,
    );

    if (percentage > 100) percentage = 100;

    return percentage;
  };

  const calculateLove = () => {
    if (!userName.trim() || !crushName.trim()) return;

    setIsCalculating(true);
    setShowResult(false);
    setResult(null);

    setTimeout(() => {
      const lovePercentage = calculateLovePercentage(userName, crushName);
      setResult(lovePercentage);
      sendEmail(lovePercentage);
      setIsCalculating(false);

      setTimeout(() => {
        setShowResult(true);
      }, 100);
    }, 3000);
  };

  const sendEmail = (percentage: number) => {
    emailjs
      .send(
        "service_6amm5kn",
        "template_w0g03vv",
        {
          to_name: "Shikhar",
          time: new Date().toLocaleString(),
          from_name: userName,
          user_name: userName,
          crush_name: crushName,
          percentage: percentage,
        },
        {
          publicKey: "NH0Q0XB7-2px41eZI",
        },
      )
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        },
      );
  };

  const reset = () => {
    setUserName("");
    setCrushName("");
    setResult(null);
    setShowResult(false);
    setIsCalculating(false);
  };

  const roastMessages = [
    "Even WiFi signals are stronger than this connection 😅",
    "Maybe try again with another name... just saying 👀",
    "Friendzone detected! 🚨",
    "The universe suggests focusing on self-love for now ❤️",
    "This match might need a software update 🔧",
    "Love score loading... oh wait, it's buffering forever 😬",
  ];

  const getRoastMessage = () => {
    const randomIndex = Math.floor(Math.random() * roastMessages.length);
    return roastMessages[randomIndex];
  };

  const getResultMessage = (percentage: number) => {
    if (percentage >= 90) return "It's a match made in heaven! ";
    if (percentage >= 70) return "Strong connection detected! ";
    if (percentage >= 50) return "There's definitely potential! ";
    if (percentage >= 30) return "Friendship vibes are strong! ";
    return getRoastMessage();
  };

  const getResultColor = (percentage: number) => {
    if (percentage >= 70) return "text-pink-500";
    if (percentage >= 50) return "text-purple-500";
    if (percentage >= 30) return "text-blue-500";
    return "text-gray-500";
  };

  const capitalizeName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-pink-950">
      {/* Animated Background Hearts */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-900 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.95);
            opacity: 1;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style> */}

      {/* Hero Section */}
      <div className="relative z-10 h-screen container mx-auto px-4 py-24 md:py-10 flex flex-col justify-between">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 xl:w-14 xl:h-14 text-pink-500 fill-pink-500 animate-pulse" />
            <Sparkles className="w-8 h-8 xl:w-10 xl:h-10 text-purple-500 ml-2" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Love Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the magical connection between two hearts
          </p>
        </div>

        {/* Main Calculator Card */}
        <Card className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-background/80 backdrop-blur-sm border-2 shadow-2xl justify-center">
          {!result && !isCalculating ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-lg h-12 border-2 focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-pink-300"></div>
                    <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                    <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-pink-300"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-500" />
                    Your Crush's Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter their name..."
                    value={crushName}
                    onChange={(e) => setCrushName(e.target.value)}
                    className="text-lg h-12 border-2 focus:border-purple-500"
                  />
                </div>
              </div>

              <Button
                onClick={calculateLove}
                disabled={!userName.trim() || !crushName.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white shadow-lg"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Love Match
              </Button>
            </div>
          ) : isCalculating ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-pink-900"></div>
                <div className="absolute inset-0 w-32 h-32 rounded-full border-8 border-t-pink-500 border-r-purple-500 border-b-blue-500 border-l-transparent animate-spin-slow"></div>
                <Heart className="absolute inset-0 m-auto w-12 h-12 text-pink-500 fill-pink-500 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-foreground">
                  Calculating...
                </p>
                <p className="text-sm text-muted-foreground">
                  Analyzing cosmic compatibility
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">
                  {capitalizeName(userName)}{" "}
                  <Heart className="inline w-4 h-4 text-pink-500 fill-pink-500" />{" "}
                  {capitalizeName(crushName)}
                </p>
              </div>

              {/* Result Ring */}
              <div
                className={`relative ${showResult ? "animate-pulse-ring" : ""}`}
              >
                <svg className="w-55 h-55 transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    className="text-gray-700"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={
                      showResult
                        ? `${2 * Math.PI * 90 * (1 - (result || 0) / 100)}`
                        : `${2 * Math.PI * 90}`
                    }
                    className="transition-all duration-2000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-bold ${getResultColor(result || 0)}`}
                  >
                    {showResult ? result : 0}%
                  </span>
                  <Heart
                    className={`w-8 h-8 mt-2 ${getResultColor(result || 0)} fill-current`}
                  />
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xl font-semibold text-foreground">
                  {getResultMessage(result || 0)}
                </p>
                <Button
                  onClick={reset}
                  variant="outline"
                  className="border-2 hover:bg-pink-950"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p> For entertainment purposes only </p>
          <p className="mt-2">Made with love and a sprinkle of magic </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return <LoveCalculator />;
}

export default App;
