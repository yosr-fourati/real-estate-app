// client/src/data/tnLocations.ts
export const TN_LOCATIONS: Record<string, string[]> = {
  // Grand Tunis
  "Tunis": [
    "Tunis",
    "La Marsa",
    "Carthage",
    "Sidi Bou Saïd",
    "La Goulette",
    "Le Kram",
    "El Menzah",
    "Lafayette",
    "Centre-Ville",
    "El Omrane",
    "El Omrane Supérieur",
    "El Kabaria",
  ],
  "Ariana": [
    "Ariana",
    "Ennasr",
    "El Menzah 5/6/7/8",
    "La Soukra",
    "Raoued",
    "Sidi Thabet",
    "Kalaat El Andalous",
    "Mnihla",
    "Ettadhamen",
  ],
  "Ben Arous": [
    "Ben Arous",
    "Ezzahra",
    "Rades",
    "Mégrine",
    "Hammam Lif",
    "Hammam Chatt",
    "Bou Mhel",
    "Mornag",
  ],
  "Manouba": [
    "Manouba",
    "Oued Ellil",
    "Douar Hicher",
    "Den Den",
    "El Batan",
    "Borj El Amri",
    "Mornaguia",
    "Tebourba",
  ],

  // A few extras to get you started—expand later
  "Nabeul": ["Nabeul", "Hammamet", "Bir Bouragba", "Dar Chaabane", "Korba"],
  "Sousse": ["Sousse", "Hammam Sousse", "Kalaâ Kebira", "Msaken", "Enfidha"],
  "Monastir": ["Monastir", "Sahline", "Ksar Hellal", "Jemmal", "Sayada"],
};

// Helper lists
export const ALL_GOUVERNORATS = Object.keys(TN_LOCATIONS).sort();
