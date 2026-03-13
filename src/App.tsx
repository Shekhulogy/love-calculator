import { useState } from "react";
import { Heart, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import emailjs from "@emailjs/browser";

type FlamesResult = {
  percentage: number;
  category: string;
  emoji: string;
  message: string;
};

// Module-level — computed once, never re-runs on render
const backgroundHearts = [...Array(20)].map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  width: `${Math.random() * 30 + 20}px`,
  height: `${Math.random() * 30 + 20}px`,
  animationDuration: `${Math.random() * 10 + 10}s`,
  animationDelay: `${Math.random() * 5}s`,
}));

const LoveCalculator = () => {
  const [userName, setUserName] = useState("");
  const [crushName, setCrushName] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [flamesResult, setFlamesResult] = useState<FlamesResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // ── Combined FLAMES + Numerology logic ──────────────────
  const calculateLovePercentage = (
    name1: string,
    name2: string,
  ): FlamesResult => {
    const clean = (n: string) => n.toLowerCase().replace(/[^a-z]/g, "");

    const arr1 = clean(name1).split("");
    const arr2 = clean(name2).split("");

    [...arr1].forEach((char) => {
      const idx = arr2.indexOf(char);
      if (idx !== -1) {
        arr1.splice(arr1.indexOf(char), 1);
        arr2.splice(idx, 1);
      }
    });

    const count = arr1.length + arr2.length || 1;

    const flamesList = ["F", "L", "A", "M", "E", "S"];
    const active = [0, 1, 2, 3, 4, 5];
    let idx = 0;

    while (active.length > 1) {
      idx = (idx + count - 1) % active.length;
      active.splice(idx, 1);
      if (idx === active.length) idx = 0;
    }

    const flamesKey = flamesList[active[0]];

    const categories: Record<
      string,
      {
        category: string;
        emoji: string;
        min: number;
        max: number;
        message: string;
      }
    > = {
      F: {
        category: "Friends",
        emoji: "🤝",
        min: 40,
        max: 55,
        message: "A powerful friendly bond between you two!",
      },
      L: {
        category: "Love",
        emoji: "❤️",
        min: 75,
        max: 95,
        message: "Love is in the air! 💕",
      },
      A: {
        category: "Affection",
        emoji: "🥰",
        min: 65,
        max: 80,
        message: "Deep caring and affection detected!",
      },
      M: {
        category: "Marriage",
        emoji: "💍",
        min: 85,
        max: 100,
        message: "It's a match made in heaven!",
      },
      E: {
        category: "Enemies",
        emoji: "⚡",
        min: 10,
        max: 30,
        message: "Opposites attract... sometimes 😅",
      },
      S: {
        category: "Siblings",
        emoji: "👫",
        min: 30,
        max: 45,
        message: "You're like family to each other!",
      },
    };

    const { category, emoji, min, max, message } = categories[flamesKey];

    const letterVal = (c: string) => c.charCodeAt(0) - 96;
    const sumName = (name: string) =>
      clean(name)
        .split("")
        .reduce((s, c) => s + letterVal(c), 0);
    const reduceToSingle = (n: number): number => {
      while (n > 9)
        n = String(n)
          .split("")
          .reduce((s, d) => s + +d, 0);
      return n;
    };

    const ln1 = reduceToSingle(sumName(name1));
    const ln2 = reduceToSingle(sumName(name2));

    const range = max - min;
    const nudge = (ln1 * 7 + ln2 * 13) % (range + 1);
    const percentage = Math.min(100, Math.max(0, min + nudge));

    return { percentage, category, emoji, message };
  };

  const calculateLove = () => {
    if (!userName.trim() || !crushName.trim()) return;

    setIsCalculating(true);
    setShowResult(false);
    setResult(null);
    setFlamesResult(null);

    setTimeout(() => {
      const flames = calculateLovePercentage(userName, crushName);
      setResult(flames.percentage);
      setFlamesResult(flames);
      sendEmail(flames.percentage, flames.category);
      setIsCalculating(false);

      setTimeout(() => setShowResult(true), 100);
    }, 3000);
  };

  const sendEmail = (percentage: number, category: string) => {
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
          category: category,
        },
        { publicKey: "NH0Q0XB7-2px41eZI" },
      )
      .then(
        () => console.log("SUCCESS!"),
        (error) => console.log("FAILED...", error.text),
      );
  };

  const reset = () => {
    setUserName("");
    setCrushName("");
    setResult(null);
    setFlamesResult(null);
    setShowResult(false);
    setIsCalculating(false);
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
    // min-h-screen on mobile (allow scroll), h-screen on md+ (lock to viewport)
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-gradient-to-br from-gray-900 via-purple-950 to-pink-950">
      {/* Background hearts */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {backgroundHearts.map((heart) => (
          <Heart
            key={heart.id}
            className="absolute text-pink-900 opacity-20"
            style={{
              left: heart.left,
              top: heart.top,
              width: heart.width,
              height: heart.height,
              animation: `float ${heart.animationDuration} ease-in-out infinite`,
              animationDelay: heart.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Inner flex column fills full height on md+ */}
      <div className="relative z-10 flex flex-col min-h-screen md:h-screen">
        {/* ── Header — compact on md+ to save vertical space ── */}
        <header className="text-center px-4 pt-6 pb-3 sm:pt-8 sm:pb-4 md:pt-5 md:pb-2 lg:pt-8 lg:pb-4 shrink-0">
          <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-2">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 text-pink-500 fill-pink-500 animate-pulse" />
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 text-purple-500 ml-2" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2">
            Love Calculator
          </h1>
          <p className="text-sm sm:text-base md:text-sm lg:text-base text-muted-foreground max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
            Discover the magical connection between two hearts
          </p>
        </header>

        {/* ── Card — flex-1 so it fills remaining height, centered ── */}
        <main className="flex-1 flex items-center justify-center px-4 py-2 sm:py-4 md:py-2 overflow-hidden">
          <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto p-4 sm:p-6 md:p-6 lg:p-8 xl:p-10 bg-background/80 backdrop-blur-sm border-2 shadow-2xl">
            {/* ── Input form ── */}
            {!result && !isCalculating && (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
                      Your Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your name..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && calculateLove()}
                      className="text-base sm:text-lg h-11 sm:h-12 border-2 focus:border-pink-500"
                    />
                  </div>

                  <div className="flex items-center justify-center py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent to-pink-300" />
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 fill-pink-500" />
                      <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-l from-transparent to-pink-300" />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                      Your Crush's Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter their name..."
                      value={crushName}
                      onChange={(e) => setCrushName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && calculateLove()}
                      className="text-base sm:text-lg h-11 sm:h-12 border-2 focus:border-purple-500"
                    />
                  </div>
                </div>

                <Button
                  onClick={calculateLove}
                  disabled={!userName.trim() || !crushName.trim()}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white shadow-lg"
                >
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Calculate Love Match
                </Button>
              </div>
            )}

            {/* ── Loading spinner ── */}
            {isCalculating && (
              <div className="py-8 sm:py-12 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 border-pink-900" />
                  <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 border-t-pink-500 border-r-purple-500 border-b-blue-500 border-l-transparent animate-spin-slow" />
                  <Heart className="absolute inset-0 m-auto w-9 h-9 sm:w-12 sm:h-12 text-pink-500 fill-pink-500 animate-pulse" />
                </div>
                <div className="text-center space-y-1 sm:space-y-2">
                  <p className="text-lg sm:text-xl font-semibold text-foreground">
                    Calculating...
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Analyzing cosmic compatibility
                  </p>
                </div>
              </div>
            )}

            {/* ── Result ── */}
            {result !== null && !isCalculating && (
              <div className="py-1 sm:py-2 flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-2 lg:space-y-3">
                {/* Names */}
                <p className="text-sm sm:text-base text-muted-foreground text-center">
                  {capitalizeName(userName)}{" "}
                  <Heart className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500 fill-pink-500" />{" "}
                  {capitalizeName(crushName)}
                </p>

                {/* FLAMES badge */}
                {flamesResult && showResult && (
                  <div className="text-center animate-pulse flex items-center">
                    <span className="text-2xl sm:text-3xl md:text-3xl">
                      {flamesResult.emoji}
                    </span>
                    <p className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-pink-500 mt-0.5">
                      {flamesResult.category}
                    </p>
                  </div>
                )}

                {/* Result Ring — smaller on md to prevent scroll */}
                <div
                  className={`relative w-36 h-36 sm:w-44 sm:h-44 md:w-40 md:h-40 lg:w-52 lg:h-52 xl:w-56 xl:h-56 ${showResult ? "animate-pulse-ring" : ""}`}
                >
                  <svg
                    viewBox="0 0 224 224"
                    className="w-full h-full transform -rotate-90"
                  >
                    <circle
                      cx="112"
                      cy="112"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      className="text-gray-700"
                    />
                    <circle
                      cx="112"
                      cy="112"
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
                      style={{ transitionDuration: "2000ms" }}
                      className="transition-all ease-out"
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
                      className={`text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold ${getResultColor(result || 0)}`}
                    >
                      {showResult ? result : 0}%
                    </span>
                    <Heart
                      className={`w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 mt-1 ${getResultColor(result || 0)} fill-current`}
                    />
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm sm:text-base md:text-base lg:text-lg font-semibold text-foreground text-center px-2">
                  {flamesResult?.message}
                </p>

                <Button
                  onClick={reset}
                  variant="outline"
                  className="border-2 hover:bg-pink-950 text-sm sm:text-base px-6 sm:px-8"
                >
                  Try Again
                </Button>
              </div>
            )}
          </Card>
        </main>

        {/* ── Footer ── */}
        <footer className="text-center text-xs sm:text-sm text-muted-foreground px-4 py-3 sm:py-4 shrink-0">
          <p>For entertainment purposes only</p>
          <p className="mt-1">Made with love and a sprinkle of magic</p>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return <LoveCalculator />;
}

export default App;
