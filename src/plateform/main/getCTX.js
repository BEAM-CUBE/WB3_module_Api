const { _httpCallAuthenticated } = require("./3dexperience_api");

/**
 * La fonction `getAllContextSecurity` effectue une requête HTTP GET authentifiée pour récupérer toutes
 * les ressources de sécurité du contexte.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier la demande.
 *  Il inclut généralement des propriétés telles qu'ici « space » et « tenant ».(ex: credentials.space, credentials.tenant).
 * @property space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace, 3DSwym, 3DCompass...)
 * @property tenant - le tenant courant (ex: R1132100968447).
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque la requête HTTP sera terminée avec
 * succès. Il prend deux paramètres : "rep" (la réponse JSON analysée) et "headers" (les en-têtes de
 * réponse).
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de la requête HTTP. Il faut trois arguments : « réponse », « en-têtes » et « xhr ».
 * L'argument `response` contient le corps de la réponse d'erreur, l'argument `headers` contient les
 * en-têtes de réponse,
 */
function getAllContextSecurity(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  const URL = {
    base: `${credentials.space}`,
    uri: "/resources/bps/cspaces",
    optTenant: `tenant=${credentials.tenant}`,
  };

  const url = `${URL.base}${URL.uri}?${URL.optTenant}`;

  _httpCallAuthenticated(url, {
    method: "GET",
    headers: {
      Accept: "application/json,text/javascript,*/*",
      "Content-Type": "application/ds-json",
    },
    onComplete(response, headers) {
      const rep = JSON.parse(response);

      if (onDone) onDone(rep, headers);
    },
    onFailure(response, headers, xhr) {
      if (onError) onError(response, headers, xhr);
    },
  });
}
module.exports = { getAllContextSecurity };
