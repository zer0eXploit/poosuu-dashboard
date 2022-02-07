import React from "react";
import ContentLoader from "react-content-loader";

export const CardLoader = (props) => (
  <ContentLoader
    speed={2}
    width={400}
    height={150}
    viewBox="0 0 400 150"
    backgroundColor="#d4d4d4"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="186" y="23" rx="5" ry="5" width="162" height="24" />
    <rect x="187" y="72" rx="0" ry="0" width="128" height="34" />
    <rect x="187" y="113" rx="0" ry="0" width="128" height="34" />
    <rect x="19" y="14" rx="0" ry="0" width="150" height="150" />
  </ContentLoader>
);
