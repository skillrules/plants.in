import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export const Route = createFileRoute("/user")({
  head: () => ({ meta: [{ title: "My Account — Plantsin" }] }),
  component: UserDashboard,
});

function UserDashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 mt-16 md:mt-24">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant text-center max-w-md mx-auto">
          <UserCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground mb-8">
            You are signed in as <strong className="text-foreground">{user.email}</strong>
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              className="w-full rounded-full"
              onClick={() => navigate({ to: "/" })}
            >
              Go to Shop
            </Button>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="w-full rounded-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
