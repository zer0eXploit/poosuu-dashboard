import poosuuAPI from "../api/poosuu";

export function updateNameAvatar({ adminId, name, avatarUrl }) {
  return poosuuAPI.request({
    url: `/admins/${adminId}`,
    method: "PUT",
    data: { name, avatarUrl },
  });
}
