import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Mail,
  Code,
  Dna,
  FlaskConical,
  Layers,
  FileText,
  BookOpen,
  Scale,
  Heart,
  ExternalLinkIcon,
} from "lucide-react";
import { useOutletContext, useParams, Link } from "react-router";
import type { RecordLoaderData } from "@/router/router";
import Header from "./components/Header";
import { Button } from "@/components/ui/button";

const RecordOverview = () => {
  const { metadata, accession, identifier, mds, published } =
    useOutletContext<RecordLoaderData>();
  const { id } = useParams();
  const recordRouteId = id ?? accession ?? identifier ?? "";

  return (
    <div className="space-y-6 p-6">
      <Header
        metadata={metadata}
        accession={accession}
        identifier={identifier}
        published={published}
      />

      <Separator />

      {/* Simulation Details Card */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Simulation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metadata.PROGRAM && (
            <div className="flex items-center gap-3">
              <Code className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">Program</div>
                <div className="text-sm text-muted-foreground">
                  {metadata.PROGRAM}{" "}
                  {metadata.VERSION && `v${metadata.VERSION}`}
                </div>
              </div>
            </div>
          )}

          {metadata.METHOD && (
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">Method</div>
                <div className="text-sm text-muted-foreground">
                  {metadata.METHOD}
                </div>
              </div>
            </div>
          )}

          {mds && mds.length > 0 && (
            <div className="flex items-center gap-3">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">MD Trajectories</div>
                <div className="text-sm text-muted-foreground">
                  {mds.length}{" "}
                  {mds.length === 1 ? "trajectory" : "trajectories"}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <Button className="absolute right-6">
          <Link to={`/records/${recordRouteId}/experiments`}>
            Explore Experiments
          </Link>
        </Button>
      </Card>

      {/* Contributors Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contributors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metadata.AUTHORS && metadata.AUTHORS.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Authors</div>
              <div className="flex flex-wrap gap-2">
                {metadata.AUTHORS.map((author, idx) =>
                  idx !== metadata.AUTHORS!.length - 1 ? `${author}, ` : author
                )}
              </div>
            </div>
          )}

          {metadata.GROUPS && metadata.GROUPS.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Research Groups</div>
              <div className="flex flex-wrap gap-2">
                {metadata.GROUPS.map((group, idx) => (
                  <Badge key={idx} variant="secondary">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {metadata.CONTACT && (
            <div className="flex items-start gap-3 pt-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium">Contact</div>
                <div className="text-sm text-muted-foreground wrap-break-word">
                  {metadata.CONTACT}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* License Card */}
      {(metadata.LICENSE || metadata.LINKCENSE) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4" />
              License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {metadata.LICENSE && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {metadata.LICENSE}
              </p>
            )}
            {metadata.LINKCENSE && (
              <a
                href={metadata.LINKCENSE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                View License Details
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Citation Card */}
      {metadata.CITATION && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Citation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {metadata.CITATION.split("(br)").map((line, idx, array) => {
                // Check if this line is a legend (starts with a number followed by space)
                const isLegend = /^\d+\s/.test(line.trim());

                return (
                  <span
                    key={idx}
                    className={
                      isLegend
                        ? "block mt-2 pl-4 border-l-2 border-muted-foreground/30 text-xs italic"
                        : "block"
                    }
                  >
                    {line.split(/(\^[\d,]+)/g).map((part, partIdx) => {
                      // Check if this part is a superscript pattern like ^1 or ^1^,^2
                      if (part.match(/^\^[\d,]+$/)) {
                        // Remove the ^ prefix and any remaining ^
                        const superscriptText = part.replace(/\^/g, "");
                        return (
                          <sup key={partIdx} className="text-xs">
                            {superscriptText}
                          </sup>
                        );
                      }
                      return <span key={partIdx}>{part}</span>;
                    })}
                    {idx < array.length - 1 && <br />}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sequences Section */}
      {((metadata.SEQUENCES && metadata.SEQUENCES.length > 0) ||
        (metadata.PROTSEQ && metadata.PROTSEQ.length > 0) ||
        (metadata.NUCLSEQ && metadata.NUCLSEQ.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="h-5 w-5" />
              Sequences
            </CardTitle>
            <CardDescription>
              Protein and nucleic acid sequences in the simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Check if PROTSEQ/NUCLSEQ exist - if so, use those instead of SEQUENCES */}
              {metadata.PROTSEQ || metadata.NUCLSEQ ? (
                <>
                  {/* Protein Sequences */}
                  {metadata.PROTSEQ && metadata.PROTSEQ.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-foreground">
                        Protein Sequences
                      </div>
                      {metadata.PROTSEQ.map((sequence, idx) => (
                        <div
                          key={`prot-${idx}`}
                          className="rounded-lg bg-muted p-3"
                        >
                          <div className="text-xs font-semibold text-muted-foreground mb-1">
                            Protein {idx + 1} ({sequence.length} residues)
                          </div>
                          <div className="font-mono text-sm break-all leading-relaxed">
                            {sequence}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nucleic Acid Sequences */}
                  {metadata.NUCLSEQ && metadata.NUCLSEQ.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-foreground">
                        Nucleic Acid Sequences
                      </div>
                      {metadata.NUCLSEQ.map((sequence, idx) => (
                        <div
                          key={`nucl-${idx}`}
                          className="rounded-lg bg-muted p-3"
                        >
                          <div className="text-xs font-semibold text-muted-foreground mb-1">
                            Nucleic Acid {idx + 1} ({sequence.length} bases)
                          </div>
                          <div className="font-mono text-sm break-all leading-relaxed">
                            {sequence}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Fall back to general SEQUENCES if PROTSEQ/NUCLSEQ don't exist */
                metadata.SEQUENCES &&
                metadata.SEQUENCES.length > 0 && (
                  <div className="space-y-3">
                    {metadata.SEQUENCES.map((sequence, idx) => (
                      <div
                        key={`seq-${idx}`}
                        className="rounded-lg bg-muted p-3"
                      >
                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                          Sequence {idx + 1} ({sequence.length} residues)
                        </div>
                        <div className="font-mono text-sm break-all leading-relaxed">
                          {sequence}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MD Trajectories List */}
      {mds && mds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              MD Trajectories
            </CardTitle>
            <CardDescription>
              Available molecular dynamics trajectories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mds.map((md, idx) => (
                <Link
                  to={`/records/${recordRouteId}/experiments/${encodeURIComponent(
                    md
                  )}`}
                  key={md ?? idx}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div className="font-mono text-sm">{md}</div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acknowledgements */}
      {metadata.THANKS && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Acknowledgements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {metadata.THANKS}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecordOverview;
