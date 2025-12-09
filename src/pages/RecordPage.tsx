import RecordLayout from "@/components/layout/record/RecordLayout";
import { Outlet, useLoaderData } from "react-router";
import type { RecordLoaderData } from "@/router/router";

const RecordPage = () => {
  const record = useLoaderData<RecordLoaderData>();

  return (
    <RecordLayout record={record}>
      <Outlet context={record} />
    </RecordLayout>
  );
};

export default RecordPage;
