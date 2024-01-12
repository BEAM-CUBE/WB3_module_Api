import { _httpCallAuthenticated } from "./3dexperience_api.js";
import { mainStore } from "../store/index";

export function _AppMngt_get_users(
  host,
  tenant,
  onDone = undefined,
  onError = undefined,
) {
  let url = `${host}/resources/AppsMngt/user?platform=${tenant}&limit=-1&xrequestedwith=xmlhttprequest`;

  _httpCallAuthenticated(url, {
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      console.log("_AppMngt_get_users => ", info);
      if (onDone) onDone(info);
    },
    onFailure(response) {
      if (onError) onError(response);
    },
  });
}

export function _AppMngt_get_info_user(
  host,
  tenant,
  id,
  onDone = undefined,
  onError = undefined,
) {
  let url = `${host}/resources/AppsMngt/user?platform=${tenant}&id=${id}&xrequestedwith=xmlhttprequest`;

  _httpCallAuthenticated(url, {
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      //console.log("_AppMngt_get_info_user => ", info);
      if (onDone) onDone(info);
    },

    onFailure(response) {
      if (onError) onError(response);
    },
  });
}
