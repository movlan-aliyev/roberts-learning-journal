"use client";
import { useEffect, useState } from "react";
import { db, type OwnerProfile } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { BookOpen, Save } from "lucide-react";

export default function AboutPage() {
  const { isOwner, updateProfile } = useAuth();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    db.ownerProfile.get("owner").then(p => { if (p) { setProfile(p); setBio(p.bio); } });
  }, []);

  async function handleSave() {
    await updateProfile({ bio });
    setProfile(prev => prev ? { ...prev, bio } : prev);
    setEditing(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-8">
      <div className="text-center mb-8">
        <BookOpen size={40} className="text-teal mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold mb-2">About</h1>
        <p className="text-lg text-muted dark:text-muted-dark">Robert Aliyev</p>
      </div>

      <Card padding="lg">
        {editing ? (
          <div className="space-y-4">
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Write your bio here..." className="min-h-[200px]" />
            <div className="flex gap-2">
              <Button onClick={handleSave}><Save size={14} /> Save</Button>
              <Button variant="ghost" onClick={() => { setBio(profile?.bio || ""); setEditing(false); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            {profile?.bio ? (
              <div className="prose whitespace-pre-wrap">{profile.bio}</div>
            ) : (
              <p className="text-muted dark:text-muted-dark italic text-center py-8">
                {isOwner ? "Your bio is empty. Click edit to add one." : "Bio coming soon."}
              </p>
            )}
            {isOwner && (
              <div className="mt-4 pt-4 border-t border-border dark:border-border-dark">
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit bio</Button>
              </div>
            )}
          </>
        )}
      </Card>

      <Card padding="lg" className="mt-6">
        <h2 className="font-serif text-xl font-semibold mb-3">What is this site?</h2>
        <p className="text-muted dark:text-muted-dark mb-3">
          This is a personal learning journal. I study a wide range of topics -- flags, geography, science, Quran,
          literature, brands, sports, books, and films -- and share what I learn with verified sources and honest perspective.
        </p>
        <p className="text-muted dark:text-muted-dark">
          I also follow structured learning programs in driving, home construction, gardening, livestock, automotive repair,
          firearm safety, and communication skills. The private learning workspace helps me study daily, track progress,
          and review with spaced repetition.
        </p>
      </Card>
    </div>
  );
}
