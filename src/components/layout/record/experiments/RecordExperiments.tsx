import { Outlet, useOutletContext, useParams } from "react-router";
import type { RecordLoaderData } from "@/router/router";

import RecordExperimentsSidebar from "./RecordExperimentsSidebar";

const RecordExperiments = () => {
  const record = useOutletContext<RecordLoaderData>();

  const { id, replicaId } = useParams();

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight">
        {record.metadata.NAME}
      </h1>

      <div className="flex flex-1 gap-6">
        <RecordExperimentsSidebar
          mds={record.mds}
          replicaId={replicaId}
          id={id}
        />

        <Outlet context={record} />
      </div>
    </div>
  );
};

export default RecordExperiments;
