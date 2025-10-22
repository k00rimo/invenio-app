import RecordTrajectories from "@/components/layout/recordDetail/RecordTrajectories";
import { useRecord } from "@/hooks";
import { useParams } from "react-router";

const RecordTrajectoriesPage = () => {
  const { id } = useParams();
  const { data, error, isPending, isError } = useRecord(id);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data) return <div>No data found</div>;

  return <RecordTrajectories recordData={data} />;
};

export default RecordTrajectoriesPage;
