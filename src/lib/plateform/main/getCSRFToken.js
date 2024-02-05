import { _httpCallAuthenticated } from "./3dexperience_api";
/**
 * @description La fonction `getCSRFToken` est une fonction asynchrone qui récupère un jeton CSRF à partir d'une URL
 * spécifiée et appelle le rappel `onDone` avec le jeton en cas de succès, ou le rappel `onError` avec
 * une erreur en cas d'échec.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space » et « ctx ».
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 *
 * @param {Function} onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le jeton
 * CSRF sera récupéré avec succès. Il faut un argument, qui est la valeur du jeton CSRF.
 * @param {Function} onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une erreur lors de la requête HTTP. Il est facultatif et peut être utilisé pour gérer les erreurs qui se produisent lors de la demande.
 *
 */
// export async function getCSRFToken(credentials, onDone, onError) {
//   if (credentials.space) {
//     const url = `${credentials.space}/resources/v1/application/CSRF`;
//     _httpCallAuthenticated(url, {
//       onComplete(response) {
//         response = JSON.parse(response);
//         console.log("getCSRFToken() / response => ", response);
//         if (onDone) onDone(response.csrf);
//       },
//       onFailure(error, headers, xhr) {
//         const infos = { error, headers, xhr };
//         if (onError) onError(infos);
//       },
//     });
//   }
// }
export const getCSRFToken = async (credentials, onDone, onError) => {
  if (!credentials.space) return;
  const url = `${credentials.space}/resources/v1/application/CSRF`;

  try {
    const response = await _httpCallAuthenticated(
      url,
      (rep) => {
        const parsedResponse = JSON.parse(response);
        console.log("getCSRFToken() / response => ", parsedResponse);
        onDone?.(parsedResponse.csrf);
      },
      (err) => {
        onError?.({ error, headers, xhr });
      },
    );
  } catch (erreur) {
    onError?.("erreur", erreur);
  }
};
