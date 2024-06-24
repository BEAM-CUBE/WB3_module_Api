import { _httpCallAuthenticated } from "../main/3dexperience_api";

/**
 * @description La fonction `_3DSwym_get_version` récupère le token du 3DSwym et effectue des actions supplémentaires si nécessaire. Obligatoire pour chaque appel d'API du Swym.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque les
 * informations de version seront récupérées avec succès. Il prend un argument, `tokenInfo`, qui est la
 * réponse contenant les informations de version. Le token est aussi envoyé dans une nouvelle propriété : `credentials.token`
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de la requête HTTP. Il est facultatif et peut être indéfini.
 */
export async function _3DSwym_get_version(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  const url = credentials._3DSwym + "/api/index/tk";

  return _httpCallAuthenticated(url, {
    onComplete(response, headers, xhr) {
      const tokenInfo = JSON.parse(response);

      if (onDone) {
        onDone(tokenInfo);
        return (credentials["token"] = tokenInfo?.result?.ServerToken);
      }
    },

    onFailure(response) {
      if (onError) onError(response);
    },
  });
}

/**
 * La fonction `_3DSwym_getAllNews` récupère toutes les actualités d'une plateforme 3DExperience en
 * utilisant les informations d'identification fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête sera terminée avec succès. Il prend deux arguments : « réponse » et « en-têtes ». L'argument
 * `response` contient les données de réponse du serveur et l'argument `headers` contient les en-têtes
 * de réponse.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_getAllNews`. Il prend deux paramètres : « réponse
 * » et « en-têtes ». Le paramètre `response` contient les données de réponse à l'erreur et le
 */
export function _3DSwym_getAllNews(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  // ! Attention beaucoup d'infos à trier et checker
  // voir aussi les possibilités des params

  const url = `${credentials.space}/api/exalead/whatsnew`;
  const data = {
    params: {
      community_id: null,
      hash_key: null,
      legacyFormat: false,
      nresults: 1,
      query: "#all",
      start: 0,
    },
  };
  _3DSwym_get_version(credentials, (token) => {
    _httpCallAuthenticated(url, {
      method: "POST",
      headers: {
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      data: JSON.stringify(data),
      type: "json",
      onComplete(response, headers) {
        if (onDone) onDone(response, headers);
      },
      onFailure(response, headers) {
        if (onError) onError(response, headers);
      },
    });
  });
}

/**
 * La fonction `_3DSwym_getFamiliarPeople` récupère une liste de personnes familières en fonction du
 * profil de l'utilisateur actuel.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'appel
 * d'API réussit et que les données sont récupérées. Il faut deux arguments : `myContacts` et
 * `response`. `myContacts` est un tableau d'objets contenant le login et le nom complet des personnes
 * familières. `réponse
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_getFamiliarPeople`. Il prend deux paramètres : «
 * réponse » et « en-têtes ». Le paramètre `response` contient la réponse d'erreur du serveur
 */
export function _3DSwym_getFamiliarPeople(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  const url = `${credentials.space}/api/Recommendation/getpeoplefamiliartocurrentuser`;
  const _data = {
    params: {
      idsToFilterArr: [],
      mode: "offline",
      limit: 30,
      itemType: "User",
      maxNbOfCommonElements: "5",
    },
  };
  _3DSwym_get_version(credentials, (token) => {
    _httpCallAuthenticated(url, {
      method: "POST",
      headers: {
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      data: JSON.stringify(_data),
      type: "json",
      onComplete(response, headers) {
        const myContacts = response.result.hits.map((contact) => {
          return { login: contact.login, fullName: contact.name };
        });

        if (onDone) onDone(myContacts, response);
      },
      onFailure(response, headers) {
        if (onError) onError(response, headers);
      },
    });
  });
}
