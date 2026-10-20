export type Phrase = { kn: string; tr: string; en: string; note?: string };
export type Lesson = { id: string; title: string; summary: string; phrases: Phrase[] };
export type Module = {
  id: string;
  number: number;
  title: string;
  situation: string;
  goal: Goal[];
  lessons: Lesson[];
};
export type Goal = "travel" | "college" | "work" | "daily" | "general";

export const MODULES: Module[] = [
  {
    id: "basics",
    number: 1,
    title: "Kannada Basics",
    situation: "Greetings & polite words",
    goal: ["general", "daily"],
    lessons: [
      {
        id: "basics-greetings",
        title: "Greetings & introductions",
        summary: "Say hello, ask how someone is and share your name.",
        phrases: [
          { kn: "ನಮಸ್ಕಾರ", tr: "namaskāra", en: "Hello / Greetings" },
          { kn: "ಹೇಗಿದ್ದೀರಾ?", tr: "hēgiddīrā?", en: "How are you?" },
          { kn: "ನಾನು ಚೆನ್ನಾಗಿದ್ದೀನಿ", tr: "nānu chennāgiddīni", en: "I am fine" },
          { kn: "ನಿಮ್ಮ ಹೆಸರೇನು?", tr: "nimma hesarēnu?", en: "What is your name?" },
          { kn: "ನನ್ನ ಹೆಸರು ಪ್ರಿಯಾ", tr: "nanna hesaru Priyā", en: "My name is Priya" },
        ],
      },
      {
        id: "basics-polite",
        title: "Yes, no, please & thank you",
        summary: "The small words that make every conversation polite.",
        phrases: [
          { kn: "ಹೌದು", tr: "haudu", en: "Yes" },
          { kn: "ಇಲ್ಲ", tr: "illa", en: "No" },
          { kn: "ದಯವಿಟ್ಟು", tr: "dayaviṭṭu", en: "Please" },
          { kn: "ಧನ್ಯವಾದಗಳು", tr: "dhanyavādagaḷu", en: "Thank you" },
          { kn: "ಕ್ಷಮಿಸಿ", tr: "kṣamisi", en: "Sorry / Excuse me" },
        ],
      },
      {
        id: "basics-questions",
        title: "Question words",
        summary: "What, where, when, how much and why.",
        phrases: [
          { kn: "ಏನು?", tr: "ēnu?", en: "What?" },
          { kn: "ಎಲ್ಲಿ?", tr: "elli?", en: "Where?" },
          { kn: "ಯಾವಾಗ?", tr: "yāvāga?", en: "When?" },
          { kn: "ಎಷ್ಟು?", tr: "eṣṭu?", en: "How much?" },
          { kn: "ಯಾಕೆ?", tr: "yāke?", en: "Why?" },
        ],
      },
    ],
  },
  {
    id: "travel",
    number: 2,
    title: "Travel & Transportation",
    situation: "Buses, autos & directions",
    goal: ["travel", "daily"],
    lessons: [
      {
        id: "travel-directions",
        title: "Asking for directions",
        summary: "Find your way with left, right and straight.",
        phrases: [
          { kn: "ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?", tr: "bas nildāṇa ellide?", en: "Where is the bus stop?" },
          { kn: "ಬಲಕ್ಕೆ ಹೋಗಿ", tr: "balakke hōgi", en: "Go right" },
          { kn: "ಎಡಕ್ಕೆ ಹೋಗಿ", tr: "eḍakke hōgi", en: "Go left" },
          { kn: "ನೇರವಾಗಿ ಹೋಗಿ", tr: "nēravāgi hōgi", en: "Go straight" },
          { kn: "ಎಷ್ಟು ದೂರ?", tr: "eṣṭu dūra?", en: "How far?" },
        ],
      },
      {
        id: "travel-auto",
        title: "Bus & auto-rickshaw",
        summary: "Talk fares and destinations with confidence.",
        phrases: [
          { kn: "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಬರ್ತೀರಾ?", tr: "Mejesṭikge bartīrā?", en: "Will you come to Majestic?" },
          { kn: "ಮೀಟರ್ ಹಾಕಿ", tr: "mīṭar hāki", en: "Please put the meter on" },
          { kn: "ಎಷ್ಟು ಆಗುತ್ತೆ?", tr: "eṣṭu āgutte?", en: "How much will it cost?" },
          { kn: "ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ", tr: "illi nillisi", en: "Stop here" },
          { kn: "ಈ ಬಸ್ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತೆ?", tr: "ī bas ellige hōgutte?", en: "Where does this bus go?" },
        ],
      },
    ],
  },
  {
    id: "shopping",
    number: 3,
    title: "Shopping & Food",
    situation: "Markets, cafés & bargaining",
    goal: ["daily", "travel"],
    lessons: [
      {
        id: "shopping-prices",
        title: "Asking prices & quantities",
        summary: "Shop at the market and bargain politely.",
        phrases: [
          { kn: "ಇದು ಎಷ್ಟು?", tr: "idu eṣṭu?", en: "How much is this?" },
          { kn: "ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ", tr: "swalpa kaḍime māḍi", en: "Reduce it a little" },
          { kn: "ಒಂದು ಕೆಜಿ ಕೊಡಿ", tr: "ondu keji koḍi", en: "Give me one kilo" },
          { kn: "ಅರ್ಧ ಕೆಜಿ", tr: "ardha keji", en: "Half a kilo" },
          { kn: "ಬೇಡ, ಸಾಕು", tr: "bēḍa, sāku", en: "No thanks, that's enough" },
        ],
      },
      {
        id: "shopping-food",
        title: "Ordering food",
        summary: "Order at a darshini and ask for recommendations.",
        phrases: [
          { kn: "ಒಂದು ಕಾಫಿ ಕೊಡಿ", tr: "ondu kāphi koḍi", en: "One coffee, please" },
          { kn: "ಏನು ಚೆನ್ನಾಗಿದೆ?", tr: "ēnu chennāgide?", en: "What's good here?" },
          { kn: "ಖಾರ ಕಡಿಮೆ ಮಾಡಿ", tr: "khāra kaḍime māḍi", en: "Make it less spicy" },
          { kn: "ಊಟ ಚೆನ್ನಾಗಿದೆ", tr: "ūṭa chennāgide", en: "The food is good" },
          { kn: "ಬಿಲ್ ಕೊಡಿ", tr: "bil koḍi", en: "The bill, please" },
        ],
      },
    ],
  },
  {
    id: "work",
    number: 4,
    title: "College & Workplace",
    situation: "Classmates & colleagues",
    goal: ["college", "work"],
    lessons: [
      {
        id: "work-intro",
        title: "Introducing yourself",
        summary: "Tell people who you are and what you do.",
        phrases: [
          { kn: "ನಾನು ವಿದ್ಯಾರ್ಥಿ", tr: "nānu vidyārthi", en: "I am a student" },
          { kn: "ನಾನು ಇಲ್ಲಿ ಕೆಲಸ ಮಾಡ್ತೀನಿ", tr: "nānu illi kelasa māḍtīni", en: "I work here" },
          { kn: "ನಾನು ದೆಹಲಿಯಿಂದ ಬಂದಿದ್ದೀನಿ", tr: "nānu Dehaliyinda bandiddīni", en: "I have come from Delhi" },
          { kn: "ನನಗೆ ಸ್ವಲ್ಪ ಕನ್ನಡ ಬರುತ್ತೆ", tr: "nanage swalpa Kannaḍa barutte", en: "I know a little Kannada" },
        ],
      },
      {
        id: "work-help",
        title: "Asking for assistance",
        summary: "Ask people to repeat, slow down or help.",
        phrases: [
          { kn: "ಸಹಾಯ ಮಾಡ್ತೀರಾ?", tr: "sahāya māḍtīrā?", en: "Could you help me?" },
          { kn: "ಇನ್ನೊಂದು ಸಲ ಹೇಳಿ", tr: "innondu sala hēḷi", en: "Please say it once more" },
          { kn: "ನಿಧಾನವಾಗಿ ಮಾತಾಡಿ", tr: "nidhānavāgi mātāḍi", en: "Please speak slowly" },
          { kn: "ಅರ್ಥ ಆಯ್ತು", tr: "artha āytu", en: "I understood" },
          { kn: "ಗೊತ್ತಿಲ್ಲ", tr: "gottilla", en: "I don't know" },
        ],
      },
    ],
  },
  {
    id: "health",
    number: 5,
    title: "Healthcare & Emergencies",
    situation: "Hospitals, pharmacies & urgent help",
    goal: ["travel", "daily", "general"],
    lessons: [
      {
        id: "health-places",
        title: "Finding help",
        summary: "Find a hospital or pharmacy and ask for urgent help.",
        phrases: [
          { kn: "ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?", tr: "āspatre ellide?", en: "Where is the hospital?" },
          { kn: "ಮೆಡಿಕಲ್ ಶಾಪ್ ಎಲ್ಲಿದೆ?", tr: "meḍikal śāp ellide?", en: "Where is the pharmacy?" },
          { kn: "ಸಹಾಯ ಮಾಡಿ!", tr: "sahāya māḍi!", en: "Help!" },
          { kn: "ಡಾಕ್ಟರ್ ಬೇಕು", tr: "ḍākṭar bēku", en: "I need a doctor" },
        ],
      },
      {
        id: "health-feelings",
        title: "Describing discomfort",
        summary: "Explain simple symptoms and needs.",
        phrases: [
          { kn: "ನನಗೆ ಹುಷಾರಿಲ್ಲ", tr: "nanage huṣārilla", en: "I am not feeling well" },
          { kn: "ತಲೆ ನೋವು", tr: "tale nōvu", en: "Headache" },
          { kn: "ಜ್ವರ ಇದೆ", tr: "jvara ide", en: "I have a fever" },
          { kn: "ಹೊಟ್ಟೆ ನೋವು", tr: "hoṭṭe nōvu", en: "Stomach ache" },
          { kn: "ನೀರು ಬೇಕು", tr: "nīru bēku", en: "I need water" },
        ],
      },
    ],
  },
  {
    id: "everyday",
    number: 6,
    title: "Everyday Conversations",
    situation: "Neighbours & daily life",
    goal: ["daily", "general"],
    lessons: [
      {
        id: "everyday-neighbours",
        title: "Talking with neighbours",
        summary: "Friendly small talk you'll hear every day.",
        phrases: [
          { kn: "ಊಟ ಆಯ್ತಾ?", tr: "ūṭa āytā?", en: "Have you eaten?" },
          { kn: "ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀರಾ?", tr: "ellige hōgtiddīrā?", en: "Where are you going?" },
          { kn: "ಬನ್ನಿ, ಕುಳಿತುಕೊಳ್ಳಿ", tr: "banni, kuḷitukoḷḷi", en: "Come, please sit" },
          { kn: "ಮತ್ತೆ ಸಿಗೋಣ", tr: "matte sigōṇa", en: "See you again" },
        ],
      },
      {
        id: "everyday-requests",
        title: "Simple requests",
        summary: "Want, don't want, okay — the everyday essentials.",
        phrases: [
          { kn: "ಸರಿ", tr: "sari", en: "Okay" },
          { kn: "ಬೇಕು", tr: "bēku", en: "I want / I need" },
          { kn: "ಬೇಡ", tr: "bēḍa", en: "I don't want" },
          { kn: "ಒಂದು ನಿಮಿಷ", tr: "ondu nimiṣa", en: "One minute" },
          { kn: "ಪರವಾಗಿಲ್ಲ", tr: "paravāgilla", en: "It's okay / No problem" },
        ],
      },
    ],
  },
];

export const ALL_LESSONS: (Lesson & { moduleId: string; moduleTitle: string })[] = MODULES.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })),
);

export function getLesson(id: string) {
  return ALL_LESSONS.find((l) => l.id === id);
}

export type QuizQuestion = { id: string; prompt: Phrase; options: string[]; answer: string };

/** Deterministic quiz: for every phrase, pick the English meaning among 4 options. */
export function buildQuiz(lesson: Lesson): QuizQuestion[] {
  const pool = ALL_LESSONS.flatMap((l) => l.phrases.map((p) => p.en));
  return lesson.phrases.map((p, i) => {
    const own = lesson.phrases.filter((q) => q !== p).map((q) => q.en);
    const extra = pool.filter((e) => e !== p.en && !own.includes(e));
    const distractors = [...own, ...extra].filter((_, j) => (j + i) % 2 === 0 || j < 2).slice(0, 3);
    const options = [...distractors];
    options.splice(i % 4, 0, p.en);
    return { id: `${lesson.id}-q${i}`, prompt: p, options, answer: p.en };
  });
}

export function dailyPhrase(date = new Date()) {
  const all = ALL_LESSONS.flatMap((l) => l.phrases);
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return all[day % all.length]!;
}

// ---------- Real-life conversations ----------
export type ConvoStep = {
  speaker: Phrase;
  speakerName: string;
  choices: { reply: Phrase; correct: boolean; feedback: string }[];
};
export type Scenario = { id: string; title: string; place: string; steps: ConvoStep[] };

export const SCENARIOS: Scenario[] = [
  {
    id: "auto",
    title: "Taking an auto-rickshaw",
    place: "Outside a metro station",
    steps: [
      {
        speakerName: "Driver",
        speaker: { kn: "ಎಲ್ಲಿಗೆ?", tr: "ellige?", en: "Where to?" },
        choices: [
          { reply: { kn: "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಬರ್ತೀರಾ?", tr: "Mejesṭikge bartīrā?", en: "Will you come to Majestic?" }, correct: true, feedback: "Perfect — you named your destination politely." },
          { reply: { kn: "ಊಟ ಆಯ್ತಾ?", tr: "ūṭa āytā?", en: "Have you eaten?" }, correct: false, feedback: "Friendly, but the driver asked where you're going." },
        ],
      },
      {
        speakerName: "Driver",
        speaker: { kn: "ಬನ್ನಿ, ಇನ್ನೂರು ರೂಪಾಯಿ", tr: "banni, innūru rūpāyi", en: "Come, two hundred rupees" },
        choices: [
          { reply: { kn: "ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ", tr: "illi nillisi", en: "Stop here" }, correct: false, feedback: "You haven't started yet! Try asking for the meter." },
          { reply: { kn: "ಮೀಟರ್ ಹಾಕಿ", tr: "mīṭar hāki", en: "Please put the meter on" }, correct: true, feedback: "Great — asking for the meter is common and fair." },
        ],
      },
      {
        speakerName: "Driver",
        speaker: { kn: "ಸರಿ, ಕುಳಿತುಕೊಳ್ಳಿ", tr: "sari, kuḷitukoḷḷi", en: "Okay, sit down" },
        choices: [
          { reply: { kn: "ಧನ್ಯವಾದಗಳು", tr: "dhanyavādagaḷu", en: "Thank you" }, correct: true, feedback: "Lovely. You just completed a real auto ride conversation!" },
          { reply: { kn: "ಬೇಡ", tr: "bēḍa", en: "I don't want" }, correct: false, feedback: "That would cancel the ride. Try thanking the driver." },
        ],
      },
    ],
  },
  {
    id: "coffee",
    title: "Ordering at a darshini",
    place: "A busy breakfast café",
    steps: [
      {
        speakerName: "Server",
        speaker: { kn: "ನಮಸ್ಕಾರ, ಏನು ಬೇಕು?", tr: "namaskāra, ēnu bēku?", en: "Hello, what would you like?" },
        choices: [
          { reply: { kn: "ಏನು ಚೆನ್ನಾಗಿದೆ?", tr: "ēnu chennāgide?", en: "What's good here?" }, correct: true, feedback: "Smart — asking for a recommendation." },
          { reply: { kn: "ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?", tr: "āspatre ellide?", en: "Where is the hospital?" }, correct: false, feedback: "Hopefully you don't need that here! Try asking what's good." },
        ],
      },
      {
        speakerName: "Server",
        speaker: { kn: "ಮಸಾಲೆ ದೋಸೆ ಚೆನ್ನಾಗಿದೆ", tr: "masāle dōse chennāgide", en: "The masala dosa is good" },
        choices: [
          { reply: { kn: "ಸರಿ, ಒಂದು ಕಾಫಿ ಕೂಡ ಕೊಡಿ", tr: "sari, ondu kāphi kūḍa koḍi", en: "Okay, give me one coffee too" }, correct: true, feedback: "Excellent order!" },
          { reply: { kn: "ಗೊತ್ತಿಲ್ಲ", tr: "gottilla", en: "I don't know" }, correct: false, feedback: "Try accepting the suggestion — say “sari”." },
        ],
      },
      {
        speakerName: "Server",
        speaker: { kn: "ಇನ್ನೇನಾದರೂ ಬೇಕಾ?", tr: "innēnādarū bēkā?", en: "Anything else?" },
        choices: [
          { reply: { kn: "ಬೇಡ, ಸಾಕು. ಬಿಲ್ ಕೊಡಿ", tr: "bēḍa, sāku. bil koḍi", en: "No, that's enough. The bill, please" }, correct: true, feedback: "Wonderful — a complete café conversation." },
          { reply: { kn: "ಎಡಕ್ಕೆ ಹೋಗಿ", tr: "eḍakke hōgi", en: "Go left" }, correct: false, feedback: "That's a direction. Try “bēḍa, sāku”." },
        ],
      },
    ],
  },
  {
    id: "pharmacy",
    title: "At the pharmacy",
    place: "A neighbourhood medical shop",
    steps: [
      {
        speakerName: "Pharmacist",
        speaker: { kn: "ಹೇಳಿ, ಏನಾಯ್ತು?", tr: "hēḷi, ēnāytu?", en: "Tell me, what happened?" },
        choices: [
          { reply: { kn: "ನನಗೆ ಹುಷಾರಿಲ್ಲ, ತಲೆ ನೋವು", tr: "nanage huṣārilla, tale nōvu", en: "I'm unwell, I have a headache" }, correct: true, feedback: "Clear and specific — well done." },
          { reply: { kn: "ಮತ್ತೆ ಸಿಗೋಣ", tr: "matte sigōṇa", en: "See you again" }, correct: false, feedback: "That's a goodbye. Describe how you feel." },
        ],
      },
      {
        speakerName: "Pharmacist",
        speaker: { kn: "ಜ್ವರ ಇದೆಯಾ?", tr: "jvara ideyā?", en: "Do you have a fever?" },
        choices: [
          { reply: { kn: "ಇಲ್ಲ, ಜ್ವರ ಇಲ್ಲ", tr: "illa, jvara illa", en: "No, no fever" }, correct: true, feedback: "Great use of “illa”." },
          { reply: { kn: "ಒಂದು ಕೆಜಿ ಕೊಡಿ", tr: "ondu keji koḍi", en: "Give me one kilo" }, correct: false, feedback: "Not at a pharmacy! Answer yes (haudu) or no (illa)." },
        ],
      },
      {
        speakerName: "Pharmacist",
        speaker: { kn: "ಈ ಮಾತ್ರೆ ತಗೊಳ್ಳಿ", tr: "ī mātre tagoḷḷi", en: "Take this tablet" },
        choices: [
          { reply: { kn: "ಸರಿ, ಧನ್ಯವಾದಗಳು. ಎಷ್ಟು?", tr: "sari, dhanyavādagaḷu. eṣṭu?", en: "Okay, thank you. How much?" }, correct: true, feedback: "Perfect — you handled the whole visit in Kannada." },
          { reply: { kn: "ಬಲಕ್ಕೆ ಹೋಗಿ", tr: "balakke hōgi", en: "Go right" }, correct: false, feedback: "Try thanking them and asking the price." },
        ],
      },
    ],
  },
];

export const SITUATIONS = [
  { key: "Travel", kn: "ಪ್ರಯಾಣ", moduleId: "travel", desc: "Autos, buses and directions" },
  { key: "Shopping", kn: "ಶಾಪಿಂಗ್", moduleId: "shopping", desc: "Prices and bargaining" },
  { key: "Food", kn: "ಊಟ", moduleId: "shopping", desc: "Order at any darshini" },
  { key: "Healthcare", kn: "ಆರೋಗ್ಯ", moduleId: "health", desc: "Pharmacies and hospitals" },
  { key: "College", kn: "ಕಾಲೇಜು", moduleId: "work", desc: "Classmates and lectures" },
  { key: "Workplace", kn: "ಕೆಲಸ", moduleId: "work", desc: "Colleagues and meetings" },
];
