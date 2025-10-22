import RecordLayout from "@/components/layout/recordDetail/RecordLayout";
import { Outlet } from "react-router";

const RecordPage = () => {
  return (
    <RecordLayout>
      <Outlet />
    </RecordLayout>
  );
};

export default RecordPage;
