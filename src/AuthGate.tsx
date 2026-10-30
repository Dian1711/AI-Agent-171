import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { ShieldCheck, Sparkles, LogIn, LogOut, AlertCircle } from "lucide-react";
import "./auth.css";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    if (!supabase) return;
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    if (authError) setError(authError.message);
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error: authError } = await supabase.auth.signOut();
    if (authError) setError(authError.message);
  };

  if (loading) return <div className="auth-screen"><div className="auth-card"><div className="auth-mark"><Sparkles /></div><p>Checking your session…</p></div></div>;

  if (!isSupabaseConfigured) return (
    <div className="auth-screen"><div className="auth-card">
      <div className="auth-mark"><AlertCircle /></div><div className="auth-eyebrow">AI AGENT 171</div>
      <h1>Supabase configuration needed</h1>
      <p>The website build is missing its public Supabase URL or publishable key. Add the VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY repository variables, then redeploy.</p>
    </div></div>
  );

  if (!session) return (
    <div className="auth-screen"><div className="auth-card">
      <div className="auth-mark"><Sparkles /></div><div className="auth-eyebrow">YOUR AI WORKSPACE</div>
      <h1>Welcome to <span>AI Agent 171</span></h1>
      <p>Sign in with your Google account to access your personal AI workspace.</p>
      <button className="google-login" onClick={signIn}><LogIn size={18}/> Continue with Google</button>
      {error && <div className="auth-error">{error}</div>}
      <div className="auth-security"><ShieldCheck size={15}/> Secure sign-in powered by Supabase Auth</div>
    </div></div>
  );

  return <>{children}<button className="auth-signout" onClick={signOut} title="Sign out"><LogOut size={15}/> Sign out</button>{error && <div className="auth-error auth-floating">{error}</div>}</>;
}
