import React from "react";

import { Pane, Heading, majorScale } from "evergreen-ui";

export function Nav() {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border
      padding={majorScale(2)}
      elevation={1}
    >
      <Heading as="h4" size={500} cursor="pointer">
        Poo Suu Admins
      </Heading>
    </Pane>
  );
}
