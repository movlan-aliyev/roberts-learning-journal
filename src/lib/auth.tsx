"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db, type OwnerProfile } from "./db";
import { seedDatabase } from "./seed";

const OWNER_SESSION_KEY = "rlj-owner-session";

/** Public site PIN for Robert only. Override with NEXT_PUBLIC_OWNER_PIN before deploy. */
const OWNER_PIN = process.env.NEXT_PUBLIC_OWNER_PIN || "robert-learn";

interface AuthCtx {
  isOwner: boolean;
  profile: OwnerProfile | null;
  login: (pin: string) => boolean;
  logout: () => void;
  loading: boolean;
  updateProfile: (partial: Partial<OwnerProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  isOwner: false,
  profile: null,
  login: () => false,
  logout: () => {},
  loading: true,
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await seedDatabase();
      const p = await db.ownerProfile.get("owner");
      setProfile(p || null);
      try {
        setIsOwner(sessionStorage.getItem(OWNER_SESSION_KEY) === "1");
      } catch {
        setIsOwner(false);
      }
      setLoading(false);
    }
    init();
  }, []);

  function login(pin: string) {
    if (pin.trim() !== OWNER_PIN) return false;
    try {
      sessionStorage.setItem(OWNER_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsOwner(true);
    return true;
  }

  function logout() {
    try {
      sessionStorage.removeItem(OWNER_SESSION_KEY);
    } catch {
      /* ignore */
    }
    setIsOwner(false);
  }

  async function updateProfile(partial: Partial<OwnerProfile>) {
    if (!isOwner || !profile) return;
    const updated = { ...profile, ...partial, updatedAt: new Date().toISOString() };
    await db.ownerProfile.put(updated);
    setProfile(updated);
  }

  return (
    <AuthContext.Provider
      value={{
        isOwner,
        profile,
        login,
        logout,
        loading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
