import { _3DSpace_get_ticket } from "./3dspace_api";
import { _httpCallAuthenticated } from "./3dexperience_api";
/**
 * @description La fonction `getDownloadDocument` est une fonction asynchrone qui récupère un document à télécharger
 * à partir d'un espace et d'un ID de document spécifiés.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace, 3DSwym, 3DCompass...)
 * @param {String} docId - L'ID du document du fichier que vous souhaitez télécharger.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée une fois le
 * téléchargement terminé et réussi. Les données de réponse seront transmises comme argument. Il prend trois arguments : « reponse », « headers » et « xhr ».
 *
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur pendant le processus de téléchargement. Il prend trois arguments : « error », « headers » et « xhr ».
 *
 * @returns un objet Promesse.
 */
export async function getDownloadDocument(
  credentials,
  docId,
  onDone = undefined,
  onError = undefined,
) {
  return new Promise((result) => {
    //TODO - a test ? manque l'URL
    _3DSpace_get_ticket(credentials, docId, (reponse) => {
      _httpCallAuthenticated(reponse, {
        onComplete: (reponse, headers, xhr) => {
          result(JSON.parse(reponse));
          if (onDone) onDone(JSON.parse(reponse), headers, xhr);
          return result;
        },
        onFailure: (error, headers, xhr) => {
          if (onError) onError(error, headers, xhr);
          console.log(error, headers?.errormsg);
        },
      });
    });
  });
}
