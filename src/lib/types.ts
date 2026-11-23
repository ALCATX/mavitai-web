export type Goal = "gain" | "lose" | "maintain";
export type Diet = "carnivore" | "vegan" | "vegetarian" | "traditional";
export type PlanId = "basic" | "diamond";
export type AppScreen =
  | "welcome"
  | "plans"
  | "signup"
  | "login"
  | "recover"
  | "dashboard";
export type DashboardSection = "feed" | "shorts" | "ads" | "pro";

export type ProfileVisibility = "public" | "private";

export type UserProfile = {
  contact: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthDate: string;
  age: string;
  height: string;
  weight: string;
  goal: Goal | "";
  diet: Diet | "";
  plan: PlanId;
  mavicoins: number;
  profileVisibility: ProfileVisibility;
};

export const GOAL_OPTIONS: { id: Goal; label: string; hint: string }[] = [
  { id: "gain", label: "Ganhar peso", hint: "Músculo e volume" },
  { id: "lose", label: "Perder peso", hint: "Déficit e definição" },
  { id: "maintain", label: "Manter peso", hint: "Consistência" },
];

export const DIET_OPTIONS: { id: Diet; label: string }[] = [
  { id: "carnivore", label: "Carnívora" },
  { id: "vegan", label: "Vegana" },
  { id: "vegetarian", label: "Vegetariana" },
  { id: "traditional", label: "Tradicional" },
];

export const EMPTY_PROFILE: UserProfile = {
  contact: "",
  password: "",
  passwordConfirm: "",
  name: "",
  birthDate: "",
  age: "",
  height: "",
  weight: "",
  goal: "",
  diet: "",
  plan: "basic",
  mavicoins: 120,
  profileVisibility: "public",
};
