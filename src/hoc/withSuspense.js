import React, { Suspense } from "react";

import { Pane, Spinner } from "evergreen-ui";

function DefaultFallbackSpinner() {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      marginTop={10}
    >
      <Spinner />
    </Pane>
  );
}

export default function withSuspense(
  WrappedComponent,
  FallbackComponent = <DefaultFallbackSpinner />
) {
  return class extends React.Component {
    render() {
      return (
        <Suspense fallback={FallbackComponent}>
          <WrappedComponent {...this.props} />
        </Suspense>
      );
    }
  };
}
