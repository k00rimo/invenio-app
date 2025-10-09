import React from "react";
import { useParams } from "react-router";

const RecordPage = () => {
  const { id } = useParams();

  return <div>{id}</div>;
};

export default RecordPage;
