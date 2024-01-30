import { _httpCallAuthenticated } from "./3dexperience_api";
import { _3DSpace_file_url } from "./3dspace_api";
/**
 * @description La fonction `getDataFrom3DSpace` récupère les données d'un espace 3D en utilisant les informations
 * d'identification fournies et les préférences du widget, et appelle le rappel `onDone` avec la
 * réponse ou le rappel `onError` avec toutes les erreurs rencontrées.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token » et « space ».(ex: credentials.token, credentials.space, credentials.tenant, credentials.ctx)
 * @property space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace, 3DSwym, 3DCompass...)
 * @property token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 *
 * @param widgetPreference - Le paramètre `widgetPreference` est un objet qui contient les préférences
 * du widget. Il peut inclure des propriétés telles que la taille, la couleur, la position du widget ou
 * toute autre personnalisation spécifique au widget.
 * @param onDone - Une fonction de rappel qui sera appelée lorsque la récupération des données sera
 * réussie. Il prend la réponse comme paramètre.
 * @param onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `getDataFrom3DSpace`. Il est utilisé pour gérer et traiter
 * les erreurs qui surviennent.
 */
export function getDataFrom3DSpace(
  credentials,
  widgetPreference,
  onDone,
  onError,
) {
  _3DSpace_file_url(
    credentials.space,
    widgetPreference,
    (response) => {
      _httpCallAuthenticated(response, {
        header: { ENO_CSRF_TOKEN: credentials.token },
        onComplete: (response) => {
          if (onDone) onDone(response);
        },
        onFailure: (error) => {
          console.log("error http", error);
          if (onError) onError(error);
        },
      });
    },
    (error) => {
      console.log("error file URL", error);
      if (onError) onError(error);
    },
  );
}
