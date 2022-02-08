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

export function getAllArtists(page = 1) {
  return poosuuAPI.request({
    url: `/artists`,
    method: "GET",
    params: {
      page,
    },
  });
}

export function getArtist(id) {
  return poosuuAPI.request({
    url: `/artists/${id}`,
    method: "GET",
  });
}

export function getArtistSongs(id, page = 1) {
  return poosuuAPI.request({
    url: `/artists/${id}/songs`,
    method: "GET",
    params: {
      page,
    },
  });
}

export function postArtist({ name, bio, cover, image }) {
  return poosuuAPI.request({
    url: `/artists`,
    method: "POST",
    data: {
      name,
      bio,
      cover,
      image,
    },
  });
}

export function putArtist({ id, name, bio, cover, image }) {
  return poosuuAPI.request({
    url: `/artists/${id}`,
    method: "PUT",
    data: {
      name,
      bio,
      cover,
      image,
    },
  });
}

export function deleteArtist(id) {
  return poosuuAPI.request({
    url: `/artists/${id}`,
    method: "DELETE",
  });
}
