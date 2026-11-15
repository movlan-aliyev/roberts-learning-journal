"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db, type OwnerProfile } from "./db";
import { seedDatabase } from "./seed";

interface AuthCtx {
  isOwner: boolean;
  profile: OwnerProfile | null;
  login: (pin: string) => boolean;
  logout: () => void;
  loading: boolean;
  updateProfile: (partial: Partial<OwnerProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  isOwner: true,
  profile: null,
  login: () => true,
  logout: () => {},
  loading: true,
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await seedDatabase();
      const p = await db.ownerProfile.get("owner");
      setProfile(p || null);
      setLoading(false);
    }
    init();
  }, []);

  // Site is free and open -- no PIN / account gate
  function login(_pin: string) {
    return true;
  }

  function logout() {
    // no-op: nothing to lock
  }

  async function updateProfile(partial: Partial<OwnerProfile>) {
    if (!profile) return;
    const updated = { ...profile, ...partial, updatedAt: new Date().toISOString() };
    await db.ownerProfile.put(updated);
    setProfile(updated);
  }

  return (
    <AuthContext.Provider
      value={{
        isOwner: true,
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
