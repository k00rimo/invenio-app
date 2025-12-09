import { Outlet, useOutletContext } from "react-router";
import type { ExperimentReplicaContextValue } from "./ExperimentReplicaLayout";

const ExperimentAnalyses = () => {
  const context = useOutletContext<ExperimentReplicaContextValue>();
  if (
    !context.replicaRecord ||
    !(context.replicaRecord.analyses ?? []).length
  ) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 px-4 text-sm text-muted-foreground">
        No analyses are available for this experiment yet.
      </div>
    );
  }

  return <Outlet context={context} />;
};

export default ExperimentAnalyses;
