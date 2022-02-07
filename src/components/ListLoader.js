import React from "react";
import ContentLoader from "react-content-loader";

export const ListLoader = (props) => (
  <ContentLoader
    speed={2}
    width={613}
    height={150}
    viewBox="0 0 613 150"
    backgroundColor="#d4d4d4"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="8" y="15" rx="5" ry="5" width="593" height="13" />
    <rect x="8" y="52" rx="5" ry="5" width="593" height="13" />
    <rect x="8" y="90" rx="5" ry="5" width="593" height="13" />
    <rect x="8" y="126" rx="5" ry="5" width="593" height="13" />
  </ContentLoader>
);
