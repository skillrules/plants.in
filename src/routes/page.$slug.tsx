import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/page/$slug")({
  component: DynamicPage,
});

function DynamicPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      setError(false);
      const { data, error } = await supabase
        .from("menu_items")
        .select("title, content")
        .eq("slug", slug)
        .eq("type", "page")
        .eq("is_active", true)
        .maybeSingle();

      if (error || !data) {
        setError(true);
      } else {
        setPage(data as any);
      }
      setLoading(false);
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate({ to: "/" })} className="rounded-full">Return Home</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-8 border-b pb-6">
          {page.title}
        </h1>
        <div 
          className="prose prose-green max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary hover:prose-a:text-primary-deep"
          dangerouslySetInnerHTML={{ __html: page.content || "" }}
        />
      </main>
    
      <Footer />
    </div>
  );
}
