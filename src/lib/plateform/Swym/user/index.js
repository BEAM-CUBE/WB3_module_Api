import { _httpCallAuthenticated } from "../../main/3dexperience_api";
import { _3DSwym_get_Token } from "../3dswym_api.js";
/**
 * @description La fonction `_3DSwym_get_currentUser` est utilisée pour récupérer des informations sur l'utilisateur actuel dans une plateforme 3DExperience.
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 *
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...), Attention ici le space prend bien le 3DSwym
 *
 * @param {Function} onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'appel
 * API réussit et que les informations utilisateur sont récupérées. Il prend un argument, qui est
 * l'objet d'informations utilisateur.
 * @param {Function} onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'appel de l'API. Il prend un paramètre, qui est la réponse d'erreur de l'API.
 */
export function _3DSwym_get_currentUser(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  const url = credentials.space + "/api/user/getcurrent/";
  _3DSwym_get_Token(credentials, (token) => {
    _httpCallAuthenticated(url, {
      method: "GET",
      headers: {
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      onComplete(response, headers, xhr) {
        const info = JSON.parse(response);
        if (onDone) onDone(info.result);
      },

      onFailure(response, headers, xhr) {
        const infos = { erreur: JSON.parse(response), headers, xhr };
        if (onError) onError(infos);
      },
    });
  });
}

/**
 * @description La fonction `_3DSwym_get_findUser` est utilisée pour rechercher un utilisateur par son identifiant
 * dans un espace 3DSwym en utilisant les informations d'identification fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 *
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {String} userLogin - Le paramètre userLogin est le nom de login de l'utilisateur que vous souhaitez
 * retrouver dans la plateforme 3DSwym.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'appel
 * API sera terminé avec succès. Il prend un argument, « info », qui correspond aux données de réponse
 * renvoyées par l'API.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'appel de l'API. Il prend un paramètre, qui est la réponse d'erreur de l'API.
 */
export function _3DSwym_get_findUser(
  credentials,
  userLogin,
  onDone = undefined,
  onError = undefined
) {
  const url = credentials.space + "/api/user/find/login/" + userLogin;
  _3DSwym_get_Token(
    credentials,
    (token) => {
      _httpCallAuthenticated(url, {
        method: "GET",
        headers: { "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken },
        onComplete(response, headers, xhr) {
          const info = JSON.parse(response);

          if (onDone) onDone(info);
        },

        onFailure(response) {
          if (onError) onError(response);
        },
      });
    },
    onError
  );
}

export default {
  _3DSwym_get_currentUser,
  _3DSwym_get_findUser,
};
