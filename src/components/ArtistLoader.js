import React from "react";
import ContentLoader from "react-content-loader";

export const ArtistLoader = (props) => (
  <ContentLoader
    speed={2}
    width={1300}
    height={500}
    viewBox="0 0 1300 500"
    backgroundColor="#d4d4d4"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="220" y="252" rx="5" ry="5" width="1000" height="56" />
    <rect x="219" y="194" rx="0" ry="0" width="128" height="44" />
    <rect x="69" y="145" rx="0" ry="0" width="128" height="116" />
    <rect x="6" y="0" rx="0" ry="0" width="1300" height="188" />
  </ContentLoader>
);
