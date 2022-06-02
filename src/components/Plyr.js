import React from "react";

import { usePlyr } from "plyr-react";

import "plyr-react/plyr.css";

export const Plyr = React.forwardRef((props, ref) => {
  const { source, options = null, ...rest } = props;
  const raptorRef = usePlyr(ref, {
    source,
    options,
  });
  return <video ref={raptorRef} className="plyr-react plyr" {...rest} />;
});
