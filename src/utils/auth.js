import { poosuuLoginAPI } from "../api/poosuu";

export function postLogin({ usernameOrEmail, password }) {
  if (!usernameOrEmail) throw new Error("`usernameOrEmail` is required.");
  if (!password) throw new Error("`password` is required.");

  return poosuuLoginAPI.request({
    url: "/admins/login",
    data: { usernameOrEmail, password },
  });
}
