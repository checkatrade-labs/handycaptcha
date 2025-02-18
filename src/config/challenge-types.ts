export interface ChallengeTypeConfig {
  icon: string;
  cursor: string;
  loadingMessages: string[];
  failureMessages: string[];
}

export const challengeTypes: Record<string, ChallengeTypeConfig> = {
  plumbing: {
    icon: "🔧",
    cursor: "crosshair",
    loadingMessages: [
      "Checking the water pressure...",
      "Locating the stopcock...",
      "Measuring pipe diameter...",
      "Consulting the plumbing manual...",
    ],
    failureMessages: [
      "That's not where the leak is!",
      "Better call a plumber...",
      "Have you tried turning it off and on again?",
      "Time to break out the WD-40!",
    ],
  },
  construction: {
    icon: "🏗️",
    cursor: "crosshair",
    loadingMessages: [
      "Measuring twice...",
      "Checking load-bearing capacity...",
      "Consulting building regulations...",
      "Looking for the spirit level...",
    ],
    failureMessages: [
      "That wall isn't going anywhere!",
      "Back to the drawing board...",
      "Time to call the foreman...",
      "Did you check the blueprints?",
    ],
  },
  electrical: {
    icon: "⚡",
    cursor: "crosshair",
    loadingMessages: [
      "Testing voltage...",
      "Checking the fuse box...",
      "Ensuring proper grounding...",
      "Reading the multimeter...",
    ],
    failureMessages: [
      "Shocking attempt!",
      "That's not very bright...",
      "Current-ly not correct...",
      "Watt were you thinking?",
    ],
  },
  roofing: {
    icon: "🏠",
    cursor: "crosshair",
    loadingMessages: [
      "Checking for leaks...",
      "Inspecting the gutters...",
      "Measuring roof pitch...",
      "Looking for missing shingles...",
    ],
    failureMessages: [
      "That's not where the leak is!",
      "Through the roof with that attempt!",
      "Time to call the roofer...",
      "Shingle and ready to mingle... with a professional",
    ],
  },
  damp: {
    icon: "💧",
    cursor: "crosshair",
    loadingMessages: [
      "Checking humidity levels...",
      "Looking for water marks...",
      "Testing wall moisture...",
      "Sniffing for mildew...",
      "Consulting the dehumidifier...",
    ],
    failureMessages: [
      "That's not damp, that's modern art!",
      "Dry your eyes, that's not it...",
      "Keep looking, it's not that damp spot!",
      "Not quite right, try again...",
    ],
  },
  leak: {
    icon: "🚰",
    cursor: "crosshair",
    loadingMessages: [
      "Following the drips...",
      "Checking the water bill...",
      "Deploying moisture sensors...",
      "Getting the mop ready...",
      "Calculating drips per second...",
    ],
    failureMessages: [
      "That's supposed to be wet!",
      "The leak is in another castle...",
      "Keep looking, we're not paying for all this water!",
      "Nope, that's just your tears of frustration",
      "Have you tried using flex tape?",
    ],
  },
  crack: {
    icon: "🔨",
    cursor: "crosshair",
    loadingMessages: [
      "Measuring crack width...",
      "Checking structural integrity...",
      "Consulting the crystal ball...",
      "Getting a second opinion...",
      "Calculating the cost of repairs...",
    ],
    failureMessages: [
      "That's a feature, not a crack!",
      "Nice try, but that's just a shadow",
      "Keep looking, it's breaking my heart...",
      "Have you tried turning the wall off and on again?",
      "That's just character building!",
    ],
  },
};

// Default messages for unknown types
export const defaultConfig: ChallengeTypeConfig = {
  icon: "🔨",
  cursor: "crosshair",
  loadingMessages: [
    "Consulting the DIY manual...",
    "Measuring twice, cutting once...",
    "Searching for the right tool...",
    "Reading the instructions (just kidding)...",
  ],
  failureMessages: [
    "Not quite right...",
    "Time to call a professional?",
    "Back to the drawing board...",
    "That's a feature, not a bug!",
  ],
};

export function getChallengeTypeConfig(type: string): ChallengeTypeConfig {
  return challengeTypes[type] || defaultConfig;
}
