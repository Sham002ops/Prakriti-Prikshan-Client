import { useState, useMemo } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import ChatBot from "../components/ChatBot";
import { Bot } from "lucide-react";

type Dosha = "Vata" | "Pitta" | "Kapha";

interface Option {
  label: string;
  dosha: Dosha;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What best describes your body build?",
    options: [
      { label: "Thin and lightweight", dosha: "Vata" },
      { label: "Medium and well-built", dosha: "Pitta" },
      { label: "Heavy or solid build", dosha: "Kapha" },
    ],
  },
  {
    id: 2,
    question: "How would you describe your skin?",
    options: [
      { label: "Dry and rough", dosha: "Vata" },
      { label: "Soft, warm, and reddish", dosha: "Pitta" },
      { label: "Smooth, moist, and pale", dosha: "Kapha" },
    ],
  },
  {
    id: 3,
    question: "What is your hair like?",
    options: [
      { label: "Dry, thin, tends to fall out", dosha: "Vata" },
      { label: "Soft, oily, early graying or thinning", dosha: "Pitta" },
      { label: "Thick, oily, shiny", dosha: "Kapha" },
    ],
  },
  {
    id: 4,
    question: "How do your nails look?",
    options: [
      { label: "Rough and brittle", dosha: "Vata" },
      { label: "Soft, reddish or flexible", dosha: "Pitta" },
      { label: "Smooth, strong, white/pinkish", dosha: "Kapha" },
    ],
  },
  {
    id: 5,
    question: "How do your eyes behave?",
    options: [
      { label: "Moving quickly, restless", dosha: "Vata" },
      { label: "Sharp, intense gaze", dosha: "Pitta" },
      { label: "Calm, large, steady gaze", dosha: "Kapha" },
    ],
  },
];

const DOSHA_STYLES = {
  Vata: "bg-blue-600/20 border-blue-400 text-blue-200",
  Pitta: "bg-red-600/20 border-red-400 text-red-200",
  Kapha: "bg-green-600/40 border-green-600 text-green-200",
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Dosha>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  const totalQuestions = questions.length;
  const finished = index >= totalQuestions;
  const progress = Math.round((index / totalQuestions) * 100);

  const selectAnswer = (dosha: Dosha) => {
    const q = questions[index];
    setAnswers((prev) => ({ ...prev, [q.id]: dosha }));
    setTimeout(() => {
      setIndex((i) => i + 1);
    }, 200);
  };

  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const result = useMemo(() => {
    const tally = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.values(answers).forEach((dosha) => {
      tally[dosha] += 1;
    });
    const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    return sorted[0][0] as Dosha;
  }, [answers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-900 to-black text-white">
      <Header />

      <div className="max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto pt-16 px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 border border-emerald-800">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-emerald-400 h-6 w-6" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Prakriti Assessment
              </h1>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-black/40 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 sm:h-3 transition-all"
                style={{ width: `${finished ? 100 : progress}%` }}
              />
            </div>
            <div className="text-right text-xs mt-1 text-emerald-300">
              {finished
                ? `${totalQuestions} of ${totalQuestions} answered`
                : `${index} of ${totalQuestions} answered`}
            </div>
          </div>

          {!finished ? (
            <>
              <p className="text-base sm:text-lg font-medium mb-6">
                {questions[index].question}
              </p>
              <div className="space-y-3 sm:space-y-4">
                {questions[index].options.map((opt, i) => {
                  const active = answers[questions[index].id] === opt.dosha;
                  return (
                    <button
                      key={i}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition-all duration-200 text-sm sm:text-base
                        ${active
                          ? DOSHA_STYLES[opt.dosha]
                          : "border-emerald-700 bg-emerald-900/40 hover:bg-emerald-800/40"}`}
                      onClick={() => selectAnswer(opt.dosha)}
                    >
                      <span className="font-semibold">{opt.label}</span>
                      <span className="ml-2 text-xs opacity-70">{opt.dosha}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  className="rounded-md border border-emerald-600 bg-emerald-900/40 px-4 py-2 text-emerald-300 hover:bg-emerald-800/60 transition text-sm sm:text-base"
                  onClick={prev}
                  disabled={index === 0}
                >
                  Previous
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div
                className={`inline-block px-4 py-2 mb-4 border rounded-full text-base sm:text-lg font-bold ${
                  result === "Vata"
                    ? DOSHA_STYLES.Vata
                    : result === "Pitta"
                    ? DOSHA_STYLES.Pitta
                    : DOSHA_STYLES.Kapha
                }`}
              >
                🎉 Your Prakriti is: {result}
              </div>
              <div className="mb-4 sm:mb-6 px-2 sm:px-6">
                <h2 className="text-lg sm:text-2xl font-bold">Personalized Guidance</h2>
                <p className="text-emerald-300 mt-2 text-sm sm:text-base">
                  Explore lifestyle, diet, and routines that support your unique
                  balance. This is an educational insight — for medical concerns,
                  consult a professional.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <button
                  className="text-sm sm:text-base border border-emerald-600 bg-emerald-900/40 px-4 py-2 rounded-md text-emerald-300 hover:bg-emerald-800/60 transition"
                  onClick={() => {
                    setAnswers({});
                    setIndex(0);
                  }}
                >
                  Retake
                </button>
                <button
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-md bg-gradient-to-tr from-emerald-500 to-emerald-700 text-white flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm sm:text-base"
                  onClick={() => setIsChatOpen(true)}
                >
                  <Bot /> Ask Prakriti Bot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
        <Button
          variant="primary"
          size="md"
          text="💬 Chat with Prakriti Bot"
          onClick={() => setIsChatOpen(true)}
        />
      </div>

      {/* Chat Modal */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

