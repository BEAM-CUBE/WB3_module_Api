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
            const urlService3DPassport = serviceUrls.find(service => service.id === "3dpassport")?.url;
            const urlAPIV2Iterop = serviceUrls.find(service => service.id === "businessprocess")?.url + "/api/v2";

            const urlService = `${urlService3DPassport}/login/?service=${urlAPIV2Iterop}/auth/cas`
            _httpCallAuthenticated(urlService, {
                onComplete(response, headers) {
                    console.log("response", response);
                    console.log("headers", headers);
                },
                onFailure(response) {
                    if (onError) onError(response);
                },

            });
        })
    }
}