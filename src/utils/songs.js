import poosuuAPI from "../api/poosuu";

export function createSong({ ...data }) {
  return poosuuAPI.request({
    url: "/songs",
    method: "POST",
    data,
  });
}

export function getAllSongs(page = 1) {
  return poosuuAPI.request({
    url: "/songs",
    params: {
      page,
    },
  });
}

export function getSong(id) {
  return poosuuAPI.request({
    url: `/songs/${id}`,
  });
}

export function updateSong({ id, ...data }) {
  return poosuuAPI.request({
    url: `/songs/${id}`,
    method: "PUT",
    data,
  });
}

export function deleteSong(id) {
  return poosuuAPI.request({
    url: `/songs/${id}`,
    method: "DELETE",
  });
}
