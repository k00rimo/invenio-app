// ExperimentDefaultRedirect.tsx
import { Navigate } from "react-router";
import type { RecordLoaderData } from "@/router/router";
import { useOutletContext } from "react-router";
import type { ProjectMD } from "@/types/mdpositTypes";

const ExperimentDefaultRedirect = () => {
  const record: ProjectMD = useOutletContext<RecordLoaderData>();
  const firstReplica = record.mds[0];

  if (!firstReplica) {
    return <Navigate to="../overview" replace />;
  }

  return (
    <Navigate to={`${encodeURIComponent(firstReplica)}/overview`} replace />
  );
};

export default ExperimentDefaultRedirect;
