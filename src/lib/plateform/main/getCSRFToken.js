import { _httpCallAuthenticated } from "./3dexperience_api";

/**
 * @description La fonction `getCSRFToken` est une fonction asynchrone qui récupère un jeton CSRF à partir d'une URL
 * spécifiée et appelle le rappel `onDone` avec le jeton en cas de succès, ou le rappel `onError` avec
 * une erreur en cas d'échec.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace, 3DSwym, 3DCompass...)
 * @property space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace, 3DSwym, 3DCompass...)
 *
 * @param {Function} onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le jeton
 * CSRF sera récupéré avec succès. Il faut un argument, qui est la valeur du jeton CSRF.
 * @param {Function} onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de la requête HTTP. Il est facultatif et peut être utilisé pour gérer les erreurs qui se
 * produisent lors de la demande.

 */
export async function getCSRFToken(credentials, onDone, onError) {
  const url = `${credentials.space}/resources/v1/application/CSRF`;
  _httpCallAuthenticated(url, {
    onComplete(response) {
      response = JSON.parse(response);
      if (onDone) onDone(response.csrf);
    },
    onFailure(error) {
      if (onError) onError(error);
    },
  });
}
