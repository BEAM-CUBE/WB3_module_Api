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

                            await fetch(urlAPIV2Iterop, {
                                headers: {
                                    Authorization: `Bearer ${data?.token}`
                                },
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                                
                            })
                            .catch(err => console.log(err));

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

export async function _Iterop_ListUsers(
    credentials,
    token
) {

    if (credentials.tenant) {
        _getServiceUrl(credentials, serviceUrls => {
            console.log("serviceUrls", serviceUrls);
            const urlService3DPassport = serviceUrls.services.find(service => service.id === "3dpassport")?.url;
            const urlAPIV2Iterop = serviceUrls.services.find(service => service.id === "businessprocess")?.url + "/api/v2";
            const urlService = `${urlService3DPassport}/login/?service=${urlAPIV2Iterop}/identity/users`;

            _httpCallAuthenticated(urlService, {
                headers:{
                    Authorization: `Bearer ${token}`
                },
                async onComplete(response) {
                    console.log("response", response);
                },
                onFailure(response) {
                    if (onError) onError(response);
                },
            });
        })
    }

    await fetch(urlAPIV2Iterop, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
        })
        .catch(err => console.log(err));
}