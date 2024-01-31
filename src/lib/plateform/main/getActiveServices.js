import { widget } from "@widget-lab/3ddashboard-utils";
import { _getPlatformServices } from "./3dexperience_api";
import { _3DSpace_get_securityContexts } from "./3dspace_api";
import { _3DSwym_get_currentUser } from "../Swym/user/index";
/**
 * @description La fonction « getActiveServices » récupère les services actifs en fonction des informations
 * d'identification fournies et exécute des fonctions de rappel en cas de réussite et d'erreur.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier la demande.
 *  Il inclut généralement des propriétés telles qu'ici « space » et « tenant ».(ex: credentials.space, credentials.tenant).
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace, 3DSwym, 3DCompass...)
 * @param {String} credentials.tenant - le tenant courant (ex: R1132100968447).
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée une fois l'exécution réussie de la
 * fonction terminée. Il recevra deux arguments : la réponse de l'appel API et l'objet activeSpace.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `getActiveServices`. C'est un paramètre facultatif, donc
 * s'il n'est pas fourni, la fonction ne fera rien en cas d'erreur.
 */
export function getActiveServices(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  _getPlatformServices(
    null,
    (plateformes) => {
      let tenants = [];
      let tenantOptions = [];
      let selectedTenantValue;
      let activeSpace = {};
      let getObjActiveSpace = false;
      // Load all tenants
      for (let plateforme of plateformes) {
        if ("3DSpace" in plateforme) {
          tenantOptions.push({
            label: `${plateforme.displayName} ( ${plateforme.platformId} )`,
            value: `${tenantOptions.length}`,
          });
          tenantOptions.sort();
          tenants.push(plateforme);
        }
      }

      for (let [index, tenant] of tenants.entries()) {
        if (tenant.platformId === credentials.tenant) {
          activeSpace = tenant;
          selectedTenantValue = index;
        }
      }

      widget.addPreference({
        name: "_CurrentTenantID_",
        type: "list",
        label: "Tenant",
        defaultValue: selectedTenantValue,
        options: tenantOptions,
      });
      if (Object.keys(activeSpace).length > 0) {
        getObjActiveSpace = true;
      }

      _3DSpace_get_securityContexts(
        credentials.space,
        "ESPACE COMMUN", // "B3-R&D" ||  "ESPACE COMMUN",
        ["VPLMProjectLeader", "VPLMCreator"],
        undefined,

        (ctx) => (credentials["ctx"] = ctx),
        (err) => {
          console.log("on Error CTX =>", err);
        },
      );
      _3DSwym_get_currentUser(
        credentials,
        (reponse) => {
          if (onDone) onDone({ reponse, activeSpace, credentials });
        },
        (wrong) => {
          if (onError) onError(wrong);
        },
      );
      if (getObjActiveSpace) {
        getObjActiveSpace = false;
      }
    },

    (error) => {
      console.log("** _getPlatformServices Erreur **", error);
    },
  );
}
