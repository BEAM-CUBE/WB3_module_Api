import { _httpCallAuthenticated } from "./3dexperience_api.js";

/**
 * @description La fonction `_AppMngt_get_users` effectue un appel HTTP authentifié pour récupérer une liste
 * d'utilisateurs d'une plateforme spécifiée.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex:1132100968447)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'appel
 * API sera terminé avec succès. Il prend un argument, « info », qui correspond aux données de réponse
 * de l'API.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de la requête HTTP. Il est facultatif et peut être indéfini. S'il est fourni, il sera
 * appelé avec l'objet de réponse comme argument.
 */
export function _AppMngt_get_users(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  let url = `${credentials.space}/resources/AppsMngt/user?platform=${credentials.tenant}&limit=-1`;

  _httpCallAuthenticated(url, {
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      console.log("_AppMngt_get_users => ", info);
      if (onDone) onDone(info);
    },
    onFailure(response, headers) {
      const info = response;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;

      if (onError) onError(info);
    },
  });
}

/**
 * @description La fonction `_AppMngt_get_info_user` effectue un appel HTTP authentifié pour récupérer des
 * informations sur un utilisateur à partir d'une plateforme spécifique.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} id - Le paramètre `id` est l'identifiant unique de l'utilisateur pour lequel vous souhaitez
 * récupérer des informations.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête sera terminée avec succès. Il prend un argument, «info», qui correspond aux données de réponse du serveur.
 *
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de la requête HTTP. Il est facultatif et peut être indéfini. S'il est fourni, il sera
 * appelé avec le paramètre `response`, qui contient la réponse d'erreur du serveur.
 */
export function _AppMngt_get_info_user(
  credentials,
  id,
  onDone = undefined,
  onError = undefined,
) {
  let url = `${credentials.space}/resources/AppsMngt/user?platform=${credentials.tenant}&id=${id}`;

  _httpCallAuthenticated(url, {
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      //console.log("_AppMngt_get_info_user => ", info);
      if (onDone) onDone(info);
    },

    onFailure(response, headers) {
      const info = response;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;

      if (onError) onError(info);
    },
  });
}
