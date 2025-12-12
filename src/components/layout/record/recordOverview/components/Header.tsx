import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  metadata: {
    NAME: string;
    TYPE?: string;
    DESCRIPTION?: string;
  };
  accession?: string;
  identifier?: string;
  published: boolean;
}

const Header = ({
  metadata,
  accession,
  identifier,
  published,
}: HeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{metadata.NAME}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-mono">{accession || identifier}</span>
          {metadata.TYPE && (
            <>
              <span>•</span>
              <Badge
                className="capitalize"
                variant={
                  metadata.TYPE === "Trajectory" ? "default" : "secondary"
                }
              >
                {metadata.TYPE}
              </Badge>
            </>
          )}
          <span>•</span>
          <Badge variant={published ? "default" : "outline"}>
            {published ? "Published" : "Unpublished"}
          </Badge>
        </div>
      </div>

      {metadata.DESCRIPTION && (
        <p className="text-muted-foreground mt-4 leading-relaxed">
          {metadata.DESCRIPTION}
        </p>
      )}
    </div>
  );
};

export default Header;
