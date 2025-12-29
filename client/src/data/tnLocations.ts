// client/src/data/tnLocations.ts

/** Governorates list */
export const GOVS = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Medenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kebili",
];

/** Delegations by governorate (add more as you go) */
export const DELEGATIONS: Record<string, string[]> = {
  Tunis: [
    "Beb Bhar",
    "Le Bardo",
    "Carthage",
    "La Goulette",
    "La Marsa",
    "Sidi Bou Saïd",
    "Lac 1",
    "Lac 2",
    "El Menzah",
    "Lafayette",
  ],
  Ariana: ["Ariana Ville", "Soukra", "Raoued", "Ettadhamen", "Mnihla", "Ennasr"],
  "Ben Arous": ["Ben Arous", "Rades", "Megrine", "Ezzahra", "Hammam Chott"],
  Manouba: ["Manouba", "Oued Ellil", "Douar Hicher", "Den Den"],
  Sousse: ["Sousse Ville", "Khezama", "Hammam Sousse", "Sahloul"],
  Nabeul: ["Nabeul", "Hammamet", "Dar Chaabane", "Kelibia"],
  Sfax: ["Sfax Ville", "Sakiet Ezzit", "Sakiet Eddaier"],
  // …complete the rest whenever you want
};
