"use client";

import { useState } from "react";
import { EMPTY_PROFILE, type AppScreen, type PlanId, type UserProfile } from "@/lib/types";
import { LoginScreen, RecoverScreen } from "./AuthScreens";
import { Dashboard } from "./Dashboard";
import { PlansScreen } from "./PlansScreen";
import { SignupStepper } from "./SignupStepper";
import { WelcomeScreen } from "./WelcomeScreen";

export function FittarApp() {
  const [screen, setScreen] = useState<AppScreen>("dashboard");
  const [profile, setProfile] = useState<UserProfile>({
    ...EMPTY_PROFILE,
    name: "Marcos",
    contact: "marcos@mavitai.com",
    birthDate: birthdayTodayYearsAgo(28),
    age: "28",
    height: "178",
    weight: "82",
    goal: "gain",
    diet: "traditional",
  });

  function startSignup(plan?: PlanId) {
    if (plan) {
      setProfile((current) => ({ ...current, plan }));
    }
    setScreen("signup");
  }

  function finishLogin(contact: string) {
    setProfile((current) => ({
      ...current,
      contact,
      name: current.name.trim() || displayNameFromContact(contact),
    }));
    setScreen("dashboard");
  }

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        onCreateAccount={() => startSignup()}
        onSeePlans={() => setScreen("plans")}
        onLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "plans") {
    return (
      <PlansScreen
        onBack={() => setScreen("welcome")}
        onSelectPlan={(plan) => startSignup(plan)}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignupStepper
        profile={profile}
        onChange={setProfile}
        onBack={() => setScreen("welcome")}
        onComplete={() => setScreen("dashboard")}
        onGoToLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onBack={() => setScreen("welcome")}
        onLogin={finishLogin}
        onForgotPassword={() => setScreen("recover")}
        onCreateAccount={() => startSignup()}
      />
    );
  }

  if (screen === "recover") {
    return <RecoverScreen onBackToLogin={() => setScreen("login")} />;
  }

  return <Dashboard profile={profile} onProfileChange={setProfile} />;
}

function displayNameFromContact(contact: string) {
  if (contact.includes("@")) {
    return contact.split("@")[0] || "Atleta";
  }
  return "Atleta";
}

function birthdayTodayYearsAgo(years: number) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
