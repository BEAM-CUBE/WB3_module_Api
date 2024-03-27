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
                        .then(data => {
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

export function _Iterop_ListUsers(
    urlAPIV2Iterop,
    token
) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`${urlAPIV2Iterop}/identity/users`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}