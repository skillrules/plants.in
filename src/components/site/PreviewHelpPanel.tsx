import { useEffect, useState } from "react";
import { HelpCircle, X, RefreshCw, Rocket, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "preview-help-panel-dismissed";

/**
 * PreviewHelpPanel
 *
 * A small dev-only floating help panel that explains exactly when to use
 * Publish → Update if the external preview URL shows "Preview has not been
 * built yet". Renders only in development so it never ships to production.
 */
export function PreviewHelpPanel() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!import.meta.env.DEV) return;
    setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!import.meta.env.DEV) return null;
  if (dismissed && !open) return null;

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setDismissed(true);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] print:hidden">
      {open ? (
        <div className="w-[340px] rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                External preview help
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close help panel"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 px-4 py-4 text-sm text-foreground">
            <p className="text-muted-foreground">
              If the external preview shows{" "}
              <span className="font-medium text-foreground">
                "Preview has not been built yet"
              </span>
              , follow these steps in order:
            </p>

            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  1
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    Wait ~60 seconds
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    A new build is usually propagating after a recent edit.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  2
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Hard refresh
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Press{" "}
                    <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                      Cmd/Ctrl + Shift + R
                    </kbd>{" "}
                    in the preview tab.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  3
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Rocket className="h-3.5 w-3.5" />
                    Click Publish → Update
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Only if it still shows the placeholder after waiting.
                    Publish lives at the top-right of the Lovable editor
                    (mobile: ⋯ menu → Publish). Click{" "}
                    <span className="font-medium text-foreground">Update</span>{" "}
                    to promote the latest build.
                  </p>
                </div>
              </li>
            </ol>

            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Don't click Update for:</span>{" "}
              transient blank screens during an active build, or while
              you're still iterating — wait until your last edit is finished.
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-xs"
              >
                Don't show again
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDismissed(false);
            setOpen(true);
          }}
          aria-label="Open external preview help"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-transform hover:scale-105 hover:bg-accent"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
