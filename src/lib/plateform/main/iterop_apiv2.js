import {
    _httpCallAuthenticated,
    _getServiceUrl_3DPassport,
    _getServiceUrl
} from "./3dexperience_api";

export function _getServiceUrl_Iterop(
    credentials,
    onDone = undefined,
    onError = undefined
) {
    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            console.log("serviceUrls", serviceUrls);
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            if (onDone) onDone(urlAPIV2Iterop)
            return urlAPIV2Iterop
        });
    }
}

export function _Iterop_Auth_CAS(
    credentials,
    onDone = undefined,
    onError = undefined
) {
    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            console.log("serviceUrls", serviceUrls);
            const urlService3DPassport = serviceUrls.services.find(service => service.id === "3dpassport")?.url;
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = `${urlService3DPassport}/login/?service=${urlAPIV2Iterop}/auth/cas`;

            _httpCallAuthenticated(urlService, {
                async onComplete(response) {
                    console.log("response", response);
                    const x3ds_service_redirect_url = typeof response === "string" ? JSON.parse(response)?.x3ds_service_redirect_url : response?.x3ds_service_redirect_url;
                    await fetch(x3ds_service_redirect_url, {
                            method: "POST"
                        })
                        .then(response => response.json())
                        .then(async data => {

                            if (onDone) onDone(data?.token);
                        });
                },
                onFailure(response) {
                    if (onError) onError(response);
                },
            });
        })
    }
}

export function _Iterop_jwtUser(credentials, onDone = undefined, onError = undefined) {
    if (credentials.tenant) {
        const lowerTenant = credentials.tenant.toLowerCase();

        fetch(`https://api.uixhome.fr/${lowerTenant}/iterop/jwtuser`, {
            method: "POST"
        })
            .then(response => response.json())
            .then(result => {
                if (onDone) onDone(result);
            })
            .catch(error => {
                if (onError) onError(error);
            });
    }
}

export async function _Iterop_ListUsers(
    credentials,
    token,
    onDone = undefined,
    onError = undefined
) {

    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = `${urlAPIV2Iterop}/identity/users`;
            const tenant = credentials.tenant.toLowerCase()

            fetch(`https://api.uixhome.fr/${tenant}/iterop/listusers?t=${token}&s=${urlService}`, {
                    method: "POST",
                })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
    }
}

export async function _Iterop_getAllBusinessTables(
    credentials,
    token,
    onDone = undefined,
    onError = undefined
) {

    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = `${urlAPIV2Iterop}/repository/data/tables`;
            const tenant = credentials.tenant.toLowerCase()

            fetch(`https://api.uixhome.fr/${tenant}/iterop/repository/data/tables?t=${token}&s=${urlService}`, {
                    method: "GET",
                })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
    }
}

export async function _Iterop_getOneBusinessTable(
    credentials,
    token,
    tableId,
    onDone = undefined,
    onError = undefined
){
    if (credentials.tenant) {
        const tenant = credentials.tenant.toLowerCase()

        fetch(`https://api.uixhome.fr/${tenant}/iterop//businesstable/${tableId}?t=${token}`, {
                method: "POST",
            })
            .then((response) => response.json())
            .then((result) => {
                if (onDone) onDone(result)
            })
            .catch((error) => {
                if (onError) onError(error);
            });
    }
}
export async function _Iterop_getOneBusinessTableRows(
    credentials,
    token,
    tableId,
    onDone = undefined,
    onError = undefined
){
    if (credentials.tenant) {
        const tenant = credentials.tenant.toLowerCase()

        fetch(`https://api.uixhome.fr/${tenant}/iterop//businesstable/${tableId}/rows/?t=${token}`, {
                method: "POST",
            })
            .then((response) => response.json())
            .then((result) => {
                if (onDone) onDone(result)
            })
            .catch((error) => {
                if (onError) onError(error);
            });
    }
}

export async function _Iterop_runProcess(
    credentials,
    token,
    processKey,
    body,
    onDone = undefined,
    onError = undefined
) {

    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = encodeURIComponent(`${urlAPIV2Iterop}`);
            const tenant = credentials.tenant.toLowerCase()
            fetch(
                    `https://api.uixhome.fr/${tenant}/iterop/runtime/processes/${processKey}?t=${token}&b=${body}`, 
                    {
                        method: "POST",
                    })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
    }
}

export async function _Iterop_AddOrRemoveRows(
    credentials,
    token,
    tableId,
    rowsToAdd = [],
    rowsToRemove = [],
    onDone = undefined,
    onError = undefined
  ) {
  
    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = encodeURIComponent(`${urlAPIV2Iterop}`);
            const body = encodeURIComponent(JSON.stringify({rowsToRemove,rowsToAdd}))
            const tenant = credentials.tenant.toLowerCase()
            fetch(
                    `https://api.uixhome.fr/${tenant}/iterop/businesstable/patch/${tableId}/rows?t=${token}&b=${body}`, 
                    {
                        method: "POST",
                    })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
    }
  }

  //SECTION - Table de dépendances

  export async function _Iterop_GetAllDependencyTable(
    credentials,
    token,
    tableId,
    onDone = undefined,
    onError = undefined
  ) {
  
    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = encodeURIComponent(`${urlAPIV2Iterop}`);
            const tenant = credentials.tenant.toLowerCase()
            fetch(
                    `https://api.uixhome.fr/${tenant}/iterop/dependencytable/all/?t=${token}`, 
                    {
                        method: "POST",
                    })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
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
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = encodeURIComponent(`${urlAPIV2Iterop}`);
            const tenant = credentials.tenant.toLowerCase()
            fetch(
                    `https://api.uixhome.fr/${tenant}/iterop/dependencytable/one/${tableId}/?t=${token}`, 
                    {
                        method: "POST",
                    })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
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
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = encodeURIComponent(`${urlAPIV2Iterop}`);
            const tenant = credentials.tenant.toLowerCase()
            fetch(
                    `https://api.uixhome.fr/${tenant}/iterop/dependencytable/patch/${tableId}/?t=${token}&cli=${cli}&b=${body}`, 
                    {
                        method: "POST",
                    })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
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
        _getServiceUrl(credentials, serviceUrls => {
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = encodeURIComponent(`${urlAPIV2Iterop}`);
            const tenant = credentials.tenant.toLowerCase()
            fetch(
                    `https://api.uixhome.fr/${tenant}/iterop/dependencytable/put/${tableId}/?t=${token}&b=${body}`, 
                    {
                        method: "POST",
                    })
                .then((response) => response.json())
                .then((result) => {
                    if (onDone) onDone(result)
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        })
    }
  }