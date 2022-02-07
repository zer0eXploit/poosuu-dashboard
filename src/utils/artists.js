import poosuuAPI from "../api/poosuu";

export function searchArtists(term) {
  return poosuuAPI.request({
    url: "/artists",
    method: "GET",
    params: {
      search: term,
    },
  });
}
