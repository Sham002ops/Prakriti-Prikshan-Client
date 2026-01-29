import { useMemo, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import ChatBot from "../components/ChatBot";
import { Bot } from "lucide-react";

type Dosha = "Vata" | "Pitta" | "Kapha";

interface Option {
  label: string;
  dosha: Dosha;
  weight?: number; // defaults to 1
}

interface Question {
  id: number;
  section: "Darshan" | "Prashna-Functional" | "Prashna-Psychological";
  parameter: string; // e.g., "Shariram (Body Structure)"
  question: string;  // prompt shown in UI
  options: Option[];
}

const questions: Question[] = [
  // --------------- Darshan (Physical Examination) ---------------
  {
    id: 1,
    section: "Darshan",
    parameter: "Shariram (Body Structure)",
    question: "Select the characteristic that best matches Body Structure:",
    options: [
      { label: "Apachit shariram (Underdeveloped body)", dosha: "Vata" },
      { label: "Shariramadhya (Medium build)", dosha: "Pitta" },
      { label: "Sanhat shariram (Compact body)", dosha: "Kapha" },
    ],
  },
  {
    id: 2,
    section: "Darshan",
    parameter: "Avayavam (Body Parts)",
    question: "Select the characteristic that best matches Body Parts:",
    options: [
      { label: "Bahu kandara, sira, pratanah (Prominent tendons/veins)", dosha: "Vata" },
      { label: "Shithil mridu sandhi mans (Loose soft joints and muscles)", dosha: "Pitta" },
      { label: "Prithupina vaksh (Broad chest)", dosha: "Kapha" },
    ],
  },
  {
    id: 3,
    section: "Darshan",
    parameter: "Dat (Teeth)",
    question: "Select the characteristic that best matches Teeth:",
    options: [
      { label: "Parush dashnam (Rough teeth)", dosha: "Vata" },
      { label: "Dant vishuddh varna (Clean colored teeth)", dosha: "Pitta" },
      { label: "Dirgh nakhah (Long nails) — use Kapha trait from nails as proxy", dosha: "Kapha" },
    ],
  },
  {
    id: 4,
    section: "Darshan",
    parameter: "Netram (Eyes)",
    question: "Select the characteristic that best matches Eyes:",
    options: [
      { label: "Chal drishti (Moving gaze)", dosha: "Vata" },
      { label: "Tamra nayanam (Copper colored eyes)", dosha: "Pitta" },
      { label: "Vishal/dirghakshah (Large/elongated eyes)", dosha: "Kapha" },
    ],
  },
  {
    id: 5,
    section: "Darshan",
    parameter: "Twacha/Varnah (Skin/Complexion)",
    question: "Select the characteristic that best matches Skin/Complexion:",
    options: [
      { label: "Parush ang (Rough limbs/skin)", dosha: "Vata" },
      { label: "Tejasvi (Radiant)", dosha: "Pitta" },
      { label: "Susnigdh varnah (Very smooth complexion)", dosha: "Kapha" },
    ],
  },
  {
    id: 6,
    section: "Darshan",
    parameter: "Kesh/Lom/Shmashruh (Hair/Body hair/Beard)",
    question: "Select the characteristic that best matches Hair:",
    options: [
      { label: "Parush kesh (Rough hair)", dosha: "Vata" },
      { label: "Kshipra palityam (Early graying)", dosha: "Pitta" },
      { label: "Ghan keshah (Thick hair)", dosha: "Kapha" },
    ],
  },
  {
    id: 7,
    section: "Darshan",
    parameter: "Nakham (Nails)",
    question: "Select the characteristic that best matches Nails:",
    options: [
      { label: "Parush nakh tanu ruksh (Rough, thin, dry nails)", dosha: "Vata" },
      { label: "Tamra nakham (Copper colored nails)", dosha: "Pitta" },
      { label: "Dirgh nakhah (Long nails)", dosha: "Kapha" },
    ],
  },
  {
    id: 8,
    section: "Darshan",
    parameter: "Sandhih (Joints)",
    question: "Select the characteristic that best matches Joints:",
    options: [
      { label: "Satat sandhi shabd (Constant joint sounds)", dosha: "Vata" },
      { label: "Prashithil sandhi (Loose joints/ligaments)", dosha: "Pitta" },
      { label: "Snigdha/shalishtha sandhi (Smooth/sticky joints)", dosha: "Kapha" },
    ],
  },

  // --------------- Prashna-Functional ---------------
  {
    id: 9,
    section: "Prashna-Functional",
    parameter: "Kshut (Appetite)",
    question: "Select the characteristic that best matches Appetite:",
    options: [
      { label: "Bahu bhukam (Eats frequently)", dosha: "Vata" },
      { label: "Tikshna kshudhah (Sharp appetite)", dosha: "Pitta" },
      { label: "Alpa kshutah (Low appetite)", dosha: "Kapha" },
    ],
  },
  {
    id: 10,
    section: "Prashna-Functional",
    parameter: "Trit (Thirst)",
    question: "Select the characteristic that best matches Thirst:",
    options: [
      { label: "— Less defined for Vata; pick closest overall", dosha: "Vata" },
      { label: "Pipasavantah (Thirsty, drinks a lot)", dosha: "Pitta" },
      { label: "Alpa trishna (Low thirst)", dosha: "Kapha" },
    ],
  },
  {
    id: 11,
    section: "Prashna-Functional",
    parameter: "Cheshta Gati (Movement/Activity)",
    question: "Select the characteristic that best matches Movement/Activity:",
    options: [
      { label: "Chapal/Drut gati (Restless/Fast movement)", dosha: "Vata" },
      { label: "— Neutral option", dosha: "Pitta" },
      { label: "Mand cheshta (Slow activity, stable movement)", dosha: "Kapha" },
    ],
  },
  {
    id: 12,
    section: "Prashna-Functional",
    parameter: "Vani/Swara (Speech/Voice)",
    question: "Select the characteristic that best matches Speech/Voice:",
    options: [
      { label: "Kshamah/Jarjarah (Weak/broken)", dosha: "Vata" },
      { label: "Bhavy uccharah (Clear pronunciation)", dosha: "Pitta" },
      { label: "Gambhir shabdah (Deep/pleasant voice)", dosha: "Kapha" },
    ],
  },
  {
    id: 13,
    section: "Prashna-Functional",
    parameter: "Nidra (Sleep)",
    question: "Select the characteristic that best matches Sleep:",
    options: [
      { label: "Alpa nidra (Less sleep)", dosha: "Vata" },
      { label: "— Neutral option", dosha: "Pitta" },
      { label: "Nidralu / likes sleep and drowsiness", dosha: "Kapha" },
    ],
  },

  // --------------- Prashna-Psychological ---------------
  {
    id: 14,
    section: "Prashna-Psychological",
    parameter: "Buddhih/Smriti (Intelligence/Memory)",
    question: "Select the characteristic that best matches Intelligence/Memory:",
    options: [
      { label: "Quick to learn but poor memory / unstable mind", dosha: "Vata" },
      { label: "Medhavi / Nipun mati (Intelligent, sharp mind)", dosha: "Pitta" },
      { label: "Smritiman / Dridh shastra mati (Good/firm memory)", dosha: "Kapha" },
    ],
  },
  {
    id: 15,
    section: "Prashna-Psychological",
    parameter: "Swabhav (Temperament)",
    question: "Select the characteristic that best matches Temperament:",
    options: [
      { label: "Quick to change, quick to fear/anger (lability)", dosha: "Vata" },
      { label: "Brave/honorable/clean but can get angry/jealous", dosha: "Pitta" },
      { label: "Gentle, tolerant, forgiving, stable", dosha: "Kapha" },
    ],
  },
  {
    id: 16,
    section: "Prashna-Psychological",
    parameter: "Sohadam (Friendship)",
    question: "Select the characteristic that best matches Friendship:",
    options: [
      { label: "Fickle / unstable friendship", dosha: "Vata" },
      { label: "— Neutral option", dosha: "Pitta" },
      { label: "Stable friends", dosha: "Kapha" },
    ],
  },
  {
    id: 17,
    section: "Prashna-Psychological",
    parameter: "Vikarah (Disease susceptibility)",
    question: "Select the characteristic that best matches Disease susceptibility:",
    options: [
      { label: "Cold/trembling/stiffness common", dosha: "Vata" },
      { label: "Skin/moles/pimples/freckles common", dosha: "Pitta" },
      { label: "Few diseases, slow to develop", dosha: "Kapha" },
    ],
  },
  {
    id: 18,
    section: "Prashna-Psychological",
    parameter: "Anukatvam (Animal resemblance) — heuristic",
    question: "Pick the closest resemblance (heuristic):",
    options: [
      { label: "Shvanah/Kakah (Dog/Crow) — light, restless", dosha: "Vata" },
      { label: "Vyaghrah (Tiger) — sharp, intense", dosha: "Pitta" },
      { label: "Gajah (Elephant) — stable, robust", dosha: "Kapha" },
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
    setTimeout(() => setIndex((i) => i + 1), 150);
  };

  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const tallies = useMemo(() => {
    const tally = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.entries(answers).forEach(([qid, d]) => {
      // weight support if you add it later
      const weight =
        questions.find((q) => q.id === Number(qid))?.options.find((o) => o.dosha === d)?.weight ?? 1;
      tally[d] += weight;
    });
    return tally;
  }, [answers]);

  const result = useMemo(() => {
    const entries = Object.entries(tallies) as Array<[Dosha, number]>;
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  }, [tallies]);

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

            <div className="mt-2 text-emerald-300 text-xs">
              Section: {questions[Math.min(index, totalQuestions - 1)].section} • Parameter: {questions[Math.min(index, totalQuestions - 1)].parameter}
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

              <div className="mb-3 text-sm text-emerald-300">
                Scores — Vata: {tallies.Vata} • Pitta: {tallies.Pitta} • Kapha: {tallies.Kapha}
              </div>

              <div className="mb-4 sm:mb-6 px-2 sm:px-6">
                <h2 className="text-lg sm:text-2xl font-bold">Personalized Guidance</h2>
                <p className="text-emerald-300 mt-2 text-sm sm:text-base">
                  Explore lifestyle, diet, and routines that support balance. This is an educational insight — for medical concerns, consult a professional.
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

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
        <Button
          variant="primary"
          size="md"
          text="💬 Chat with Prakriti Bot"
          onClick={() => setIsChatOpen(true)}
        />
      </div>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
