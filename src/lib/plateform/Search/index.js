import {
    _httpCallAuthenticated,
    _getPlatformServices,
    _getPlateformInfos
} from "../main/3dexperience_api";
import {
    _3DSpace_csrf,
    _3DSpace_get_securityContexts
} from "../main/3dspace_api"
import {
    DateTime
} from "luxon";

export function _3DSearch_usersGroup(
    credentials,
    onDone = undefined,
    onError = undefined,
) {
    console.log("credentials", credentials);
    return new Promise((result) => {
        if (credentials.token === "") {
            _3DSpace_csrf(credentials);
        }
        if (!credentials.space || credentials.space === "") {
            const platformeInfo = _getPlateformInfos();
            console.log("platformeInfo", platformeInfo);
        }
        _3DSpace_get_securityContexts(
            credentials,
            "Common space",
            ["VPLMProjectLeader", "VPLMCreator"],
            undefined,
            (ctx) => (credentials["ctx"] = ctx),
            (err) => {
                console.log("onError =>", err);
            },
            true
        );
        const ts = DateTime.now().ts;

        const urlService = `https://${credentials.tenant}-eu1-registry.3dexperience.3ds.com/api/v1/platform/service/instance?serviceId=3dsearch&platformId=${credentials.tenant}`
        _httpCallAuthenticated(urlService, {
            onComplete(response) {
                if (Array.isArray(JSON.parse(response))) {
                    const oResponse = JSON.parse(response);
                    console.log("serviceId=3dsearch", oResponse);
                    const urlFedSearch = `${oResponse[0].services[0].url}/search?xrequestedwith=xmlhttprequest`

                    _httpCallAuthenticated(urlFedSearch, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        data: JSON.stringify({
                            with_indexing_date: true,
                            with_nls: false,
                            label: `3DSearch-${ts}`,
                            locale: "en",
                            select_predicate: [
                                "ds6w:label",
                                "ds6w:type",
                                "ds6w:description",
                                "ds6w:identifier",
                                "ds6w:responsible",
                                "ds6wg:fullname"
                            ],
                            select_file: [
                                "icon",
                                "thumbnail_2d"
                            ],
                            query: "([ds6w:type]:(Group) AND [ds6w:status]:(Public)) OR (flattenedtaxonomies:\"types/Person\" AND current:\"active\")",
                            order_by: "desc",
                            order_field: "relevance",
                            nresults: 1000,
                            start: "0",
                            source: [
                                "3dspace",
                                "usersgroup"
                            ],
                            tenant: credentials.tenant,
                            login: {
                                "3dspace": {
                                    SecurityContext: `ctx::${credentials.ctx}`
                                }
                            }
                        }),
                        type: "json",
                        onComplete(response) {
                            if (onDone) onDone(response);
                        },
                        onFailure(response) {
                            if (onError) onError(response);
                        },
                    });

                }
            },
            onFailure(response) {
                if (onError) onError(response);
            },
        })
    });
}