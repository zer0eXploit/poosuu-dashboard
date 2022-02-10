import { useReducer, useCallback } from "react";

import { useSafeDispatch } from "./useSafeDispatch";

import { createDebouncedFunc } from "../utils/debounce";
import { createCancellableRequestFunc } from "../utils/requests";

const initialState = {
  status: "idle",
  data: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, status: "pending" };

    case "resolved":
      return { status: "resolved", data: action.payload, error: null };

    case "rejected":
      return { status: "rejected", data: null, error: action.payload };

    case "reset":
      return { status: "idle", data: null, error: null };

    default:
      throw new Error(`Unhandled ${action.type}`);
  }
};

const f = createDebouncedFunc(createCancellableRequestFunc());

export function useSearch() {
  const [{ status, data, error }, unsafeDispatch] = useReducer(
    reducer,
    initialState
  );
  const dispatch = useSafeDispatch(unsafeDispatch);

  const search = useCallback(
    (reqOptions) => f(reqOptions, dispatch),
    [dispatch]
  );

  return {
    status,
    data,
    error,
    search,
    dispatch,
  };
}
