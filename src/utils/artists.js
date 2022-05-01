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

export function getAllArtists(page = 1, sortBy = "name") {
  return poosuuAPI.request({
    url: `/artists`,
    method: "GET",
    params: {
      page,
      sortBy,
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

export function uploadArtistPhoto({ image, width, height, left, top }) {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("width", width);
  formData.append("height", height);
  formData.append("left", left);
  formData.append("top", top);

  return poosuuAPI.request({
    url: `/artists/cover`,
    method: "POST",
    data: formData,
  });
}
