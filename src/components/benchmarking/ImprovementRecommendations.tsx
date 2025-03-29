
import React from "react";
import { ImprovementRecommendation } from "./types";
import RecommendationsTable from "./RecommendationsTable";
import ImprovementAreas from "./ImprovementAreas";

interface ImprovementRecommendationsProps {
  recommendations: ImprovementRecommendation[];
}

const ImprovementRecommendations: React.FC<ImprovementRecommendationsProps> = ({
  recommendations
}) => {
  return (
    <>
      <RecommendationsTable recommendations={recommendations} />
      <ImprovementAreas />
    </>
  );
};

export default ImprovementRecommendations;
