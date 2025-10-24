import RecordAnalyses from "@/components/layout/recordDetail/RecordAnalyses";
import { useRecord } from "@/hooks";
import { useParams } from "react-router";

const RecordAnalysesPage = () => {
  const { id } = useParams();
  const { data, error, isPending, isError } = useRecord(id);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data) return <div>No data found</div>;

  return <RecordAnalyses recordData={data} />;
};

export default RecordAnalysesPage;
