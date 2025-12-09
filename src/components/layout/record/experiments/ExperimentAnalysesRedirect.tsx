import { Navigate, useOutletContext } from "react-router";
import type { ExperimentReplicaContextValue } from "./ExperimentReplicaLayout";

const ExperimentAnalysesRedirect = () => {
  const { analysisGroups } = useOutletContext<ExperimentReplicaContextValue>();
  const firstVariant = analysisGroups[0]?.variants[0];

  if (firstVariant) {
    return <Navigate to={`${encodeURIComponent(firstVariant)}`} replace />;
  }

  return (
    <div className="text-muted-foreground">
      No analyses are available for this experiment yet.
    </div>
  );
};

export default ExperimentAnalysesRedirect;
