import { _httpCallAuthenticated } from "../main/3dexperience_api";
/**
 * @description La fonction `compass_getListAdditionalApps` effectue une requête HTTP GET authentifiée pour
 * récupérer une liste d'applications supplémentaires en fonction des informations d'identification
 * fournies.
 * @param {Object} credentials Un objet contenant les informations d'identification nécessaires à
 * l'authentification. Il doit avoir les propriétés suivantes : space, token
 * @property {String} space - (_3DCompass)L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace, 3DSwym, 3DCompass...)
 * @property {String} tenant - le tenant courant (ex: R1132100968447)
 * @param onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'appel
 * d'API réussit et que les données de réponse sont formatées. Il prend deux arguments :
 * `formatedInfos` et `info`. `formatedInfos` est un tableau d'objets contenant le nom et l'identifiant
 * de chaque application,
 * @param onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de la requête HTTP. Il prend un paramètre, « info », qui est un objet contenant des
 * informations sur l'erreur.
 */

export function compass_getListAdditionalApps(credentials, onDone, onError) {
  const URL = {
    base: `${credentials.space}`,
    uri: "/resources/AppsMngt/api/custom/applications",
    option: `?filter=${credentials.tenant}`, // facultatif
  };
  const url = `${URL.base}${URL.uri}${URL.option}`;

  _httpCallAuthenticated(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      const formatedInfos = info.data.map((app) => {
        const name = app.attributes.name;
        const id = app.id;
        return { name, id };
      });

      if (onDone) onDone(formatedInfos, info);
    },
    onFailure(response, headers) {
      const info = response;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;

      if (onError) onError(info);
    },
  });
}
