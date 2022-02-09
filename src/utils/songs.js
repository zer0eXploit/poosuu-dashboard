import poosuuAPI from "../api/poosuu";

export function createSearchSongFunc() {
  let controller;
  let prevSignal;

  return (term, dispatch) => {
    if (controller) {
      prevSignal = controller.signal;
      controller.abort();
    }

    controller = new AbortController();

    poosuuAPI
      .request({
        url: "/songs",
        method: "GET",
        params: {
          search: term,
        },
        signal: controller.signal,
      })
      .then(({ data }) => {
        dispatch({
          type: "search_success",
          payload: data,
        });
      })
      .catch((error) => {
        if (prevSignal?.aborted) return;
        console.log(error);
        dispatch({
          type: "search_failed",
          payload: error,
        });
      });
  };
}
