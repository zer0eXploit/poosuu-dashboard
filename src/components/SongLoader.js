import React from "react";
import ContentLoader from "react-content-loader";

export const SongLoader = (props) => (
  <ContentLoader
    speed={2}
    width={182}
    height={250}
    viewBox="0 0 300 400"
    backgroundColor="#d4d4d4"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="170" height="170" />
    <rect x="0" y="180" rx="0" ry="0" width="118" height="20" />
    <rect x="0" y="210" rx="0" ry="0" width="141" height="30" />
  </ContentLoader>
);
