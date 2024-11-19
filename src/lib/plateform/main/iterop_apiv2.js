import {
  _httpCallAuthenticated,
  _getServiceUrl_3DPassport,
  _getServiceUrl,
} from "./3dexperience_api";

export function _getServiceUrl_Iterop(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    _getServiceUrl(credentials, (serviceUrls) => {
      // console.log("serviceUrls", serviceUrls);
      const urlAPIV2Iterop =
        serviceUrls.services.find((service) => service.id === "businessprocess")
          ?.url + "/api/v2";
      if (onDone) onDone(urlAPIV2Iterop);
      return urlAPIV2Iterop;
    });
  }
}

export function _Iterop_Auth_CAS(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    _getServiceUrl(credentials, (serviceUrls) => {
      // console.log("serviceUrls", serviceUrls);
      const urlService3DPassport = serviceUrls.services.find(
        (service) => service.id === "3dpassport"
      )?.url;
      const urlAPIV2Iterop =
        serviceUrls.services.find((service) => service.id === "businessprocess")
          ?.url + "/api/v2";
      const urlService = `${urlService3DPassport}/login/?service=${urlAPIV2Iterop}/auth/cas`;

      _httpCallAuthenticated(urlService, {
        async onComplete(response) {
          // console.log("response", response);
          const x3ds_service_redirect_url =
            typeof response === "string"
              ? JSON.parse(response)?.x3ds_service_redirect_url
              : response?.x3ds_service_redirect_url;
          await fetch(x3ds_service_redirect_url, {
            method: "POST",
          })
            .then((response) => response.json())
            .then(async (data) => {
              if (onDone) onDone(data?.token);
            });
        },
        onFailure(response) {
          if (onError) onError(response);
        },
      });
    });
  }
}
/**
 * @description _Iterop_jwtUser appel sur l'api et demande un Token lié à l'utilisateur et au tenant.
 *
 * @return  {Function}  callback retournant la réponse de l'api
 */
export function _Iterop_jwtUser(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const lowerTenant = credentials.tenant.toLowerCase();

    fetch(`https://api.uixhome.fr/${lowerTenant}/iterop/jwtuser`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

/**
 * Retrieves all business tables.
 *
 * @param {Object} credentials - credentials.
 * @param {String} credentials.tenant - Tenant credentials.
 * @param {String} token - token iterop.
 * @param {Function} [onDone] - Callback function for successful response.
 * @param {Function} [onError] - Callback function for error response.
 * @return {Promise} Resolves with the result of the API call.
 */
export async function _Iterop_getAllBusinessTables(
  credentials,
  token,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();

    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/repository/data/tables?t=${token}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

/**
 * Retrieves data for a specific Business Table.
 *
 * @param {Object} credentials - Credentials for authentication.
 * @param {String} token - CSRF token for authentication.
 * @param {String} tableId - ID of the Business Table to retrieve data from.
 * @param {Function} [onDone] - Callback function to execute upon successful data retrieval.
 * @param {Function} [onError] - Callback function to execute if an error occurs during retrieval.
 */
export async function _Iterop_getOneBusinessTable(
  credentials,
  token,
  tableId,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();

    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/businesstable/one/${tableId}?t=${token}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}
/**
 * Retrieves rows from a specific Business Table based on the table ID.
 *
 * @param {Object} credentials - Credentials for authentication.
 * @param {String} token - CSRF token for authentication.
 * @param {String} tableId - ID of the Business Table to retrieve rows from.
 * @param {Function} [onDone] - Callback function to execute upon successful retrieval.
 * @param {Function} [onError] - Callback function to execute if an error occurs during retrieval.
 */
export async function _Iterop_getOneBusinessTableRows(
  credentials,
  token,
  tableId,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();

    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/businesstable/rows/${tableId}/?t=${token}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

/**
 * @description `_Iterop_AddOrRemoveRows` Met a jour les lignes d'une table Business.
 *
 * @param {Object} credentials - credentials.
 * @param {String} credentials.tenant - credentials.tenant @exemple "r1132480937497"
 * @param {String} token - token iterop.
 * @param {String} tableId - ID of the Business Table.
 * @param {String} body - JSON string of the rows to add or remove, e.g. {"rowsToAdd": [{"uuid": "..."}, ...], "rowsToRemove": ["...", ...]}.
 * @param {Function} [onDone] - Callback function for successful response.
 * @param {Function} [onError] - Callback function for error response.
 * @return {Promise} Resolves with the result of the API call.
 */
export async function _Iterop_AddOrRemoveRows(
  credentials,
  token,
  tableId,
  body,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();
    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/businesstable/patch/rows/${tableId}/?t=${token}&b=${body}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        //console.log("_Iterop_AddOrRemoveRows", response);
        return response.json();
      })
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error, tableId, body);
      });
  }
}

/**
 * @description _Iterop_businessTableSearchInRows rows in a Business Table.
 *
 * @param {Object} credentials - credentials.
 * @param {String} credentials.tenant - credentials.tenant @exemple "r1132480937497"
 * @param {String} token - token iterop.
 * @param {String} tableId - ID of the Business Table.
 * @param {String} columnsName - List of columns to search on, separated by '+'.
 * @param {String} body - JSON string of the filters to apply.
 * @param {Function} [onDone] - Callback function for successful response.
 * @param {Function} [onError] - Callback function for error response.
 * @return {Promise} Resolves with the result of the API call.

 */
export async function _Iterop_businessTableSearchInRows(
  credentials,
  token,
  tableId,
  columnsName,
  body,
  onDone = undefined,
  onError = undefined
) {
  // Exemple : columns = uuid+name
  // Exemple : body(String) = {"filters": [{"uuid": "e56fd041-a9c0-4f1c-91ff-643a826a84d9","isactive": true}]}
  if (credentials.tenant) {
    const url = `https://api.uixhome.fr/${credentials.tenant.toLowerCase()}/iterop/businesstable/search/rows/${tableId}?t=${token}&c=${encodeURIComponent(
      columnsName
    )}&b=${encodeURIComponent(body)}`;
    fetch(url, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        result["url"] = url;
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError)
          onError({
            error,
            tableId,
            columns: columnsName,
            body,
          });
      });
  }
}

/**
 * @description Updates a business table with the provided data.
 *
 * @param {Object} credentials - Credentials for authentication.
 * @param {String} token - CSRF token for authentication.
 * @param {String} tableId - ID of the table to update.
 * @param {String} body - Data to update the table with.
 * @param {Function} [onDone] - Callback function to execute upon successful update.
 * @param {Function} [onError] - Callback function to execute if an error occurs during the update.
 */
export async function _Iterop_updateBusinessTable(
  credentials,
  token,
  tableId,
  body,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const url = `https://api.uixhome.fr/${credentials.tenant.toLowerCase()}/iterop/businesstable/post/update/${tableId}?t=${token}&b=${encodeURIComponent(
      body
    )}`;
    fetch(url, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        //console.log("_Iterop_updateBusinessTable | _Iterop_businessTableSearchInRows | fetch | onDone", body);
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError)
          onError({
            error,
            url,
          });
      });
  }
}

/**
 * @description Fonction asynchrone, `_Iterop_runProcess` permet de lancer un processus ITEROP
 * @param   {Object} credentials  Informations d'identification du tenant.
 * @param   {String} credentials.tenant  Le tenant.
 * @param   {String} token  Le jeton CSRF.
 * @param   {String} processKey - le nom du processus ITEROP.
 * @param   {String} body - le body de la requête, doit être au format String et encodé. @exemple encodeURIComponent(JSON.stringify(body)).
 * @return  {Function}  Callback contenant le message de retour de l'api
 */
export async function _Iterop_runProcess(
  credentials,
  token,
  processKey,
  body,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();
    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/runtime/processes/${processKey}?t=${token}&b=${body}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("_Iterop_runProcess : OK");
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

//SECTION - Table de dépendances
/**
 * Récupère toutes les tables de dépendances.
 *
 * @param {Object} credentials - credentials.
 * @param {String} credentials.tenant - Tenant credentials.
 * @param {String} token - token iterop.
 * @param {Function} [onDone] - Callback function for successful response.
 * @param {Function} [onError] - Callback function for error response.
 * @return {Promise} Resolves with the result of the API call.
 */
export async function _Iterop_GetAllDependencyTable(
  credentials,
  token,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();
    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/dependencytable/all/?t=${token}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

export async function _Iterop_GetOneDependencyTable(
  credentials,
  token,
  tableId,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();
    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/dependencytable/one/${tableId}/?t=${token}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

/**
 * (cli) => Create List Items
 */
export async function _Iterop_PatchDependencyTable(
  credentials,
  token,
  tableId,
  cli,
  body,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();
    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/dependencytable/patch/${tableId}/?t=${token}&cli=${cli}&b=${body}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}

export async function _Iterop_PutDependencyTable(
  credentials,
  token,
  tableId,
  body,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();
    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/dependencytable/put/${tableId}/?t=${token}&b=${body}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}
//!SECTION

//SECTION - LISTS

export async function _Iterop_GetOneList(
  credentials,
  token,
  listId,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.tenant) {
    const tenant = credentials.tenant.toLowerCase();
    fetch(
      `https://api.uixhome.fr/${tenant}/iterop/list/one/${listId}/?t=${token}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (onDone) onDone(result);
      })
      .catch((error) => {
        if (onError) onError(error);
      });
  }
}
//!SECTION
