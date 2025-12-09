import { useOutletContext } from "react-router";
import type { ExperimentReplicaContextValue } from "./ExperimentReplicaLayout";

const ExperimentTrajectory = () => {
  const { replicaRecord, isReplicaLoading, replicaError } =
    useOutletContext<ExperimentReplicaContextValue>();

  if (isReplicaLoading) {
    return <p className="text-muted-foreground">Loading trajectory...</p>;
  }

  if (replicaError) {
    return (
      <p className="text-destructive">
        Failed to load trajectory: {replicaError.message}
      </p>
    );
  }

  if (!replicaRecord) {
    return <p className="text-muted-foreground">No trajectory available.</p>;
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Trajectory viewer coming soon for {replicaRecord.accession}
      </p>
    </div>
  );
};

export default ExperimentTrajectory;
