"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, RefreshCw } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { quiz, images } from "@/lib/config";

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = quiz[step];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (step + 1 < quiz.length) {
        setStep((s) => s + 1);
        setPicked(null);
      } else {
        setDone(true);
        if (score + (correct ? 1 : 0) === quiz.length) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ["#c9a253", "#e7c477"] });
        }
      }
    }, 800);
  };

  const reset = () => {
    setStep(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  };

  return (
    <ImmersiveSection id="quiz" image={images.quiz}>
      <div className="max-w-xl mx-auto">
        <SectionHeading
          chapter="A Little Fun"
          title="How Well Do You Know Us?"
          subtitle="Test your knowledge of the happy couple."
        />

        <div className="card-glass rounded-3xl p-8 md:p-10">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Sparkles className="h-12 w-12 text-gold mx-auto" />
                <h3 className="font-display text-4xl text-gold-gradient mt-4">
                  {score} / {quiz.length}
                </h3>
                <p className="text-ivory/70 mt-2">
                  {score === quiz.length
                    ? "Perfect! You truly know us. ❤️"
                    : "Thanks for playing — see you at the wedding!"}
                </p>
                <button
                  onClick={reset}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gold/50 text-gold hover:bg-gold/10 transition"
                >
                  <RefreshCw className="h-4 w-4" /> Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <p className="text-gold text-sm tracking-widest mb-2">
                  Question {step + 1} of {quiz.length}
                </p>
                <h3 className="font-display text-2xl text-ivory mb-6">{q.q}</h3>
                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    const isCorrect = picked !== null && i === q.answer;
                    const isWrong = picked === i && i !== q.answer;
                    return (
                      <button
                        key={opt}
                        onClick={() => choose(i)}
                        className={`w-full text-left px-5 py-3 rounded-xl border transition ${
                          isCorrect
                            ? "bg-gold/20 border-gold text-gold"
                            : isWrong
                            ? "bg-red-500/10 border-red-400/50 text-red-200"
                            : "border-gold/30 text-ivory/80 hover:border-gold"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ImmersiveSection>
  );
}
