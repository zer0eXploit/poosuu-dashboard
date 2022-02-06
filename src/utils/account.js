import poosuuAPI, { poosuuPasswordResetAPI } from "../api/poosuu";

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

export function resetPassword({ token, newPassword }) {
  return poosuuPasswordResetAPI.request({
    url: `/admins/password-reset/${token}`,
    method: "PUT",
    data: { newPassword },
  });
}
