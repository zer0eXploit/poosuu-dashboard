import poosuuAPI from "../api/poosuu";

export function updateNameAvatar({ adminId, name, avatarUrl }) {
  return poosuuAPI.request({
    url: `/admins/${adminId}`,
    method: "PUT",
    data: { name, avatarUrl },
  });
}

export function updatePassword({ oldPassword, newPassword }) {
  return poosuuAPI.request({
    url: "/admins/password",
    method: "PUT",
    data: { oldPassword, newPassword },
  });
}

export function requestPasswordResetEmail({ email }) {
  return poosuuAPI.request({
    url: "/admins/password-reset",
    method: "POST",
    data: { email },
  });
}
