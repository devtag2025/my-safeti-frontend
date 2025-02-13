import React from "react";
import IncidentReportForm from "../components/forms/reportForm";

const Report = () => {
  return (
    <div className="w-full max-w-lg sm:w-[80%] md:w-[50%] lg:w-[40%] mx-auto shadow-2xl p-8 rounded-2xl">
      <IncidentReportForm />
    </div>
  );
};

export default Report;
