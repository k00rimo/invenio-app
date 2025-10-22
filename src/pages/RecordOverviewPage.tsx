import RecordOverview from "@/components/layout/recordDetail/RecordOverview";
import { useRecord } from "@/hooks";
import { useParams } from "react-router";

const RecordOverviewPage = () => {
  const { id } = useParams();
  const { data, error, isPending, isError } = useRecord(id);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data) return <div>No data found</div>;

  return <RecordOverview recordData={data} />;
};

export default RecordOverviewPage;
