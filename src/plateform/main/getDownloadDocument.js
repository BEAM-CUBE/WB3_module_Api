const { _3DSpace_file_url } = require("./3dspace_api");
const { _httpCallAuthenticated } = require("./3dexperience_api");
/**
 * @description La fonction `getDownloadDocument` est une fonction asynchrone qui récupère un document à télécharger
 * à partir d'un espace et d'un ID de document spécifiés.
 * @param {String} space - Le paramètre space représente l'espace 3D à partir duquel le document sera
 * téléchargé. C'est un paramètre obligatoire.
 * @param {String} docId - L'ID du document du fichier que vous souhaitez télécharger.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée une fois le
 * téléchargement terminé et réussi. Les données de réponse seront transmises comme argument. Il prend trois arguments : « reponse », « headers » et « xhr ».
 *
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur pendant le processus de téléchargement. Il prend trois arguments : « error », « headers » et « xhr ».
 *
 * @returns un objet Promesse.
 */
async function getDownloadDocument(
  space,
  docId,
  onDone = undefined,
  onError = undefined,
) {
  return new Promise((result) => {
    _3DSpace_file_url(space, docId, (reponse) => {
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
module.exports = {
  getDownloadDocument,
};
