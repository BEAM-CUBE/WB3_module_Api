import {
  widget,
  requirejs
} from "@widget-lab/3ddashboard-utils";

/**
 * @description Cette fonction effectue un appel HTTP authentifié à l'aide de la bibliothèque WAFData en de la plateforme.
 * @param {String} url - L'URL du point de terminaison de l'API que la fonction appellera.
 * @param {object} options - Le paramètre `options` est un objet qui contient diverses options pour la requête
 * HTTP, telles que la méthode de requête (GET, POST, etc.), les en-têtes, le corps, etc. Ces options
 * sont généralement transmises à l'API `fetch` ou `XMLHttpRequest` pour effectuer la requête HTTP
 * réelle.
 */
export function _httpCallAuthenticated(url, options) {
  requirejs(["DS/WAFData/WAFData"], (WAFData) => {
    WAFData.authenticatedRequest(url, options);
  });
}

/**
 * @description Cette fonction définit un élément comme étant déplaçable et transmet des données et une fonction de
 * rappel à exécuter lorsque le glissement commence (drag and drop).
 * @param elem - L'élément HTML qui doit être rendu déplaçable.
 * @param strData - strData est une chaîne qui représente les données associées à l'élément déplaçable.
 * Ces données sont accessibles lors des opérations de glisser-déposer pour fournir des informations
 * supplémentaires sur l'élément déplacé.
 * @param onDrag - onDrag est une fonction de rappel qui sera exécutée au début de l'opération de
 * glissement. Il peut être utilisé pour effectuer toutes les actions nécessaires avant le début de
 * l'opération de glissement, telles que la configuration des données à transférer ou la mise à jour de
 * l'apparence de l'élément déplaçable.
 */
export function _setDraggable(elem, strData, onDrag) {
  requirejs(["DS/DataDragAndDrop/DataDragAndDrop"], (DataDragAndDrop) => {
    DataDragAndDrop.draggable(elem, {
      data: strData,
      start: onDrag
    });
  });
}

/**
 * @description Cette fonction configure un proxy de navigateur de balises avec des balises spécifiées et un événement de filtre facultatif.
 *
 * @param tags - Le paramètre tags est un tableau de chaînes représentant les balises qui seront
 * utilisées pour filtrer les sujets dans le widget TagNavigatorProxy.
 * @param [onTaggerFilter] - Le paramètre onTaggerFilter est une fonction de rappel qui sera exécutée
 * lorsque l'utilisateur filtrera les sujets dans le tagger. Il recevra les sujets filtrés en argument.
 */
export function _setupTagger(tags, onTaggerFilter = undefined) {
  requirejs(["DS/TagNavigatorProxy/TagNavigatorProxy"], (TagNavigatorProxy) => {
    let taggerProxy;
    if (taggerProxy === undefined) {
      taggerProxy = TagNavigatorProxy.createProxy({
        widgetId: widget.id,
        filteringMode: "WithFilteringServices",
      });

      if (onTaggerFilter !== undefined)
        taggerProxy.addEvent("onFilterSubjectsChange", onTaggerFilter);
    }
    taggerProxy.setSubjectsTags(tags);
  });
}

/**
 * Cette fonction définit un élément comme pouvant être déposé à l'aide de la bibliothèque
 * DataDragAndDrop.
 * @param elem - L'élément HTML qui doit être rendu déposable.
 * @param drop - Le paramètre `drop` est une fonction qui sera appelée lorsqu'un élément déplaçable est
 * déposé sur l'élément déplaçable. Il prend généralement l'élément supprimé comme argument et exécute
 * une action basée sur celui-ci.
 */
export function _setDroppable(elem, drop) {
  requirejs(["DS/DataDragAndDrop/DataDragAndDrop"], (DataDragAndDrop) => {
    DataDragAndDrop.droppable(elem, {
      drop
    });
  });
}

/**
 * @description Cette fonction asynchrone obtient les services de la plateforme à l'aide de la bibliothèque i3DXCompassServices et appelle les fonctions onComplete ou onFailure en fonction du résultat.
 *
 * @param platformId - ID de la plate-forme pour laquelle les services sont demandés. Si aucun ID de
 * plate-forme n'est fourni, la fonction tentera de récupérer l'ID à partir d'une valeur de widget. Si
 * aucun ID n'est trouvé, il sera défini sur `undefined`.
 * @param onComplete - Une fonction de rappel qui sera exécutée lorsque les services de la plateforme
 * seront récupérés avec succès. Il prend les services de plateforme récupérés comme argument.
 * @param onFailure - Le paramètre onFailure est une fonction de rappel qui sera exécutée en cas
 * d'erreur ou d'échec dans l'exécution de la fonction getPlatformServices. Il permet de gérer les
 * erreurs et de fournir un retour d'information approprié à l'utilisateur.
 */
export async function _getPlatformServices(
  platformId,
  onComplete = undefined,
  onFailure = undefined,
) {
  await requirejs(
    ["DS/i3DXCompassServices/i3DXCompassServices"],
    (i3DXCompassServices) => {
      if (!platformId || platformId === "") {
        platformId = widget.getValue("PlatFormInstanceId");
      }
      if (!platformId || platformId === "") {
        platformId = undefined;
      }
      if (onComplete) {
        onComplete(
          i3DXCompassServices.getPlatformServices({
            platformId,
            onComplete,
            onFailure,
          }),
        );
      }
    },
  );
}

/**
 * @description
 *  La fonction `_getPlateformInfos` récupère les informations sur la plateforme à l'aide du module
 * PlatformAPI et renvoie les informations dans un objet.
 * @returns un objet appelé "retourAPI" qui contient les propriétés suivantes :
 * - {String} tenant, Le tenant de la plateforme sur lequel on travaille.
 * - {Object} user, L'utilisateur connecté à la plateforme...
 * - {ArrayOfObject} appsConfiguration, liste d'app auquel on accès.
 * - {String} appConf
 *
 */
export function _getPlateformInfos() {
  let retourAPI = {};

  requirejs(["DS/PlatformAPI/PlatformAPI"], (plAPI) => {
    const tenant = plAPI.getTenant();
    const user = plAPI.getUser();
    const appsConfiguration = plAPI.getAllApplicationConfigurations();
    const appConf = plAPI.getApplicationConfiguration(
      "com.3ds.wp.passport.cors",
    );
    retourAPI = {
      tenant,
      user,
      appsConfiguration,
      appConf,
    };
  });
  console.log("%cRETOUR API :", "color:blue", retourAPI);
  return retourAPI;
}

export function _getServiceUrl(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const urlService = `https://${credentials.tenant}-eu1-apps.3dexperience.3ds.com/enovia/resources/AppsMngt/api/v1/services?tenant=${credentials.tenant}&cors=true&xrequestedwith=xmlhttprequest`
    _httpCallAuthenticated(urlService, {
      onComplete(response) {
        const oResponse = JSON.parse(response);
        console.log("_getServiceUrl", oResponse);
        if (oResponse && "platforms" in oResponse) {
          const listServiceUrl = oResponse.platforms.find(platform => {
            platform.id === credentials.tenant
          })
          if (onDone) onDone(listServiceUrl)
        }
      },
      onFailure(response) {
        if (onError) onError(response);
      },

    });
  }
}

export function _getServiceUrl_3DPassport(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const urlService = `https://${credentials.tenant}-eu1-registry.3dexperience.3ds.com/api/v1/platform/service/instance?serviceId=3dpassport&platformId=${credentials.tenant}`
    _httpCallAuthenticated(urlService, {
      onComplete(response) {
        const oResponse = JSON.parse(response);
        console.log("serviceId=3dpassport", oResponse);
        if (Array.isArray(oResponse) && oResponse.length > 0) {
          const urlServicePassport = `${oResponse[0].services[0].url}`
          if (onDone) onDone(urlServicePassport)
        }
      },
      onFailure(response) {
        if (onError) onError(response);
      },

    });
  }
}