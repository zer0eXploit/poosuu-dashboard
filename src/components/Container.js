import React from "react";

import { Pane, majorScale } from "evergreen-ui";

export function Container({ disableMt, ...props }) {
  return (
    <Pane
      marginX="auto"
      marginTop={disableMt ? 0 : "78px"}
      maxWidth={1400}
      {...props}
      padding={majorScale(2)}
    />
  );
}
