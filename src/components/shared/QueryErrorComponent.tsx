import React from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QueryErrorComponentProps = {
  title?: string;
  message?: React.ReactNode;
  error?: Error; // raw error from fetch/query/etc.
  onRetry?: () => void;
  actionLabel?: string;
  className?: string;
  compact?: boolean; // smaller paddings/typography
  children?: React.ReactNode; // extra actions/content
};

function toErrorText(err: unknown): { message?: string; stack?: string } {
  if (!err) return {};
  if (typeof err === "string") return { message: err };
  if (err instanceof globalThis.Error)
    return { message: err.message, stack: err.stack };
  try {
    return { message: JSON.stringify(err) };
  } catch {
    return { message: String(err) };
  }
}

const QueryErrorComponent: React.FC<QueryErrorComponentProps> = ({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  actionLabel = "Retry",
  className,
  compact = false,
  children,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const details = toErrorText(error);

  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-destructive/30 bg-destructive/10 text-destructive-foreground h-full m-16",
        compact ? "p-3" : "p-4 sm:p-6",
        className
      )}
    >
      <div
        className={cn("flex gap-3", compact ? "items-start" : "items-center")}
      >
        <TriangleAlert
          className={cn("shrink-0", compact ? "h-4 w-4 mt-0.5" : "h-5 w-5")}
        />
        <div className="flex-1 space-y-1">
          <h3
            className={cn("font-semibold", compact ? "text-sm" : "text-base")}
          >
            {title}
          </h3>
          {message && (
            <div
              className={cn(
                "text-muted-foreground",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {message}
            </div>
          )}
          {!message && details.message && (
            <div
              className={cn(
                "text-muted-foreground",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {details.message}
            </div>
          )}

          {details.stack && (
            <div className={cn("mt-1", compact ? "text-[11px]" : "text-xs")}>
              <button
                type="button"
                className="underline underline-offset-2"
                onClick={() => setShowDetails((v) => !v)}
              >
                {showDetails ? "Hide details" : "Show details"}
              </button>
              {showDetails && (
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-background/40 p-2 text-[11px] leading-relaxed">
                  {details.stack}
                </pre>
              )}
            </div>
          )}
        </div>
        {onRetry && (
          <Button
            size={compact ? "md" : "default"}
            variant="destructive"
            onClick={onRetry}
          >
            {actionLabel}
          </Button>
        )}
      </div>
      {children && (
        <div className={cn("mt-3", compact ? "text-xs" : "text-sm")}>
          {children}
        </div>
      )}
    </div>
  );
};

export default QueryErrorComponent;
