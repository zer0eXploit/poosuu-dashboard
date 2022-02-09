import React from "react";

import { Pane, majorScale } from "evergreen-ui";

export function Container(props) {
  return (
    <Pane marginX="auto" maxWidth={1400} {...props} padding={majorScale(2)} />
  );
}
