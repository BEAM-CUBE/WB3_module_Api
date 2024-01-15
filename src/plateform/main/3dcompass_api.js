const { _httpCallAuthenticated } = require("./3dexperience_api.js");

function _AppMngt_get_users(
  host,
  tenant,
  onDone = undefined,
  onError = undefined,
) {
  let url = `${host}/resources/AppsMngt/user?platform=${tenant}&limit=-1`;

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

function _AppMngt_get_info_user(
  host,
  tenant,
  id,
  onDone = undefined,
  onError = undefined,
) {
  let url = `${host}/resources/AppsMngt/user?platform=${tenant}&id=${id}`;

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
module.exports = { _AppMngt_get_users, _AppMngt_get_info_user };
