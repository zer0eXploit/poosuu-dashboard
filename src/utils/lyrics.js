import poosuuAPI from "../api/poosuu";

export function createLyrics(data) {
  return poosuuAPI.request({
    url: "/lyrics",
    method: "POST",
    data,
  });
}

export function getLyrics(id) {
  return poosuuAPI.request({ url: `/lyrics/${id}` });
}

export function updateLyrics({ id, ...data }) {
  return poosuuAPI.request({
    url: `/lyrics/${id}`,
    method: "PUT",
    data,
  });
}

export function deleteLyrics(id) {
  return poosuuAPI.request({ url: `/lyrics/${id}`, method: "DELETE" });
}
