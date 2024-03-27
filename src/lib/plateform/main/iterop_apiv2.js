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

export function _Iterop_Auth_CAS(
    credentials,
    onDone = undefined,
    onError = undefined
) {
    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            console.log("serviceUrls", serviceUrls);
            const urlService3DPassport = serviceUrls.services.find(service => service.id === "3dpassport")?.url;
            const urlService3DCompass = serviceUrls.services.find(service => service.id === "3dcompass")?.url;
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";

            const urlLoginTicket = `${urlService3DPassport}/login?action=get_auth_params`;
            const urlAuthCasByCompass = `${urlService3DPassport}/login/?service=${urlService3DCompass}/resources/AppsMngt/api/pull/self`;
            const urlService = `${urlService3DPassport}/login/?service=${urlAPIV2Iterop}/auth/cas`;
            
            _httpCallAuthenticated(urlLoginTicket, {
                onComplete(response) {
                    const lt = response.lt;
                    _httpCallAuthenticated(urlService, {
                        onComplete(response) {
                            console.log("response", response);
                            const x3ds_service_redirect_url = typeof response === "string" ? JSON.parse(response)?.x3ds_service_redirect_url : response?.x3ds_service_redirect_url;
                            
                            if (`${urlService3DPassport}/login/?service=${x3ds_service_redirect_url}`) {
                                _httpCallAuthenticated(x3ds_service_redirect_url, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    onComplete(response) {
                                        if (onDone) onDone(response);
                                    },
                                    onFailure(response) {
                                        if (onError) onError(response);
                                    }
                                })
                            } else {
                                if (onError) onError("x3ds_service_redirect_url is undefined");
                            }
                        },
                        onFailure(response) {
                            if (onError) onError(response);
                        },

                    });
                }
            })
        })
    }
}