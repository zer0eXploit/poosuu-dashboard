import poosuuAPI from "../api/poosuu";

export function createCancellableRequestFunc() {
  let controller;
  let prevSignal;

  return (requestOptions, dispatch) => {
    if (controller) {
      prevSignal = controller.signal;
      controller.abort();
    }

    controller = new AbortController();

    poosuuAPI
      .request({
        ...requestOptions,
        signal: controller.signal,
      })
      .then(({ data }) => {
        dispatch({
          type: "resolved",
          payload: data,
        });
      })
      .catch((error) => {
        if (prevSignal?.aborted) return;
        console.log(error);
        dispatch({
          type: "rejected",
          payload: error,
        });
      });
  };
}
