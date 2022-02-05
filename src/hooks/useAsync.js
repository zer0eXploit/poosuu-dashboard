import { useReducer, useCallback } from "react";

import { useSafeDispatch } from "./useSafeDispatch";

function reducer(state, action) {
  switch (action.type) {
    case "pending": {
      return { ...state, status: "pending" };
    }
    case "resolved": {
      return { ...state, status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      return { ...state, status: "rejected", error: action.error };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialState = {
  status: "idle",
  data: null,
  error: null,
};

export function useAsync() {
  const [state, unsafeDispatch] = useReducer(reducer, initialState);

  const dispatch = useSafeDispatch(unsafeDispatch);

  const run = useCallback(
    (promise) => {
      if (!promise) return;

      dispatch({ type: "pending" });

      promise.then(
        (data) => dispatch({ type: "resolved", data }),
        (error) => dispatch({ type: "rejected", error })
      );
    },
    [dispatch]
  );

  return { ...state, run };
}
