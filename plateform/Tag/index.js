import { _httpCallAuthenticated, _3dSpace_get_docInfo } from "@/plugins";
import { mainStore } from "@/store";
import UUID from "@/utils/generateUUID";
// LINK - https://media.3ds.com/support/documentation/developer/Cloud/en/English/CAA3DSpaceREST/CAA6WRestServicePrinciples.htm
// Doc de test sur tenant BEAM3 PROD
const objIDTEST = "B70C12CDAE0415006579A93200061A14";
// Doc de test sur tenant Pivetau TEST
const objIDTEST2 = "FA35FB9B177A28006580190400193C20";
const objIDTEST3 = "FA35FB9B177A280065800EA0000F599C";

const sourcesSearching = [
  "swym",
  "3dspace",
  "drive",
  "usersgroup",
  "3dplan",
  "dashboard",
];

const listPredicates = {
  how: "ds6w:how",
  what: "ds6w:what",
  when: "ds6w:when",
  where: "ds6w:where",
  who: "ds6w:who",
  why: "ds6w:why",
};
const objToTag = {
  objId: objIDTEST3,
  pred: "who",
  order_by: "desc",
  tag: "testTag",
};
export function addTagToDoc(obj = objToTag) {
  // getInfoDoc();
  const store = mainStore();
  const { _3DSpace, currentTenant } = store;
  const { objId, pred, tag } = obj;

  const URL = {
    uri: "/resources/6w/tags",
    otpCTX: "SecurityContext=preferred",
    optTenant: `tenant=${currentTenant}`,
  };
  const url = `${_3DSpace}${URL.uri}?${URL.otpCTX}&${URL.optTenant}`;
  const dataTest = {
    tag: [
      {
        subject: [
          {
            uri: `pid://${objId}`,
          },
        ],
        predicate: listPredicates[pred],
        object: {
          literal: tag,
        },
      },
    ],
  };

  _httpCallAuthenticated(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify(dataTest),
    onComplete(response) {
      JSON.parse(response);
      const resp = JSON.parse(response);
      console.log("addTagToDoc => ", resp);
      const info = {};
      setTimeout(() => {
        _3dSpace_get_docInfo(
          objId,
          (rep) => {
            console.log("Info Doc reponse ", rep);
            const docName = rep.data[0].dataelements.title;
            const docExt =
              rep.data[0].dataelements.fileExtension !== undefined
                ? rep.data[0].dataelements.fileExtension
                : "";
            const createBy =
              rep.data[0].relateddata.ownerInfo[0].dataelements.name;
            info["name"] = docName;
            info["ext"] = docExt;
            info["createBy"] = createBy;
            obj.info = { ...info };
            getActualTagsOnDoc(obj);
          },
          (error) => {
            console.log("erreur ", error);
          },
        );
      }, 2000);
    },
    onFailure(err) {
      console.log(err);
    },
  });
}
export function removeTagToDoc(obj = objToTag) {
  const store = mainStore();
  const { objId, pred, tag } = obj;
  console.log("removeTagToDoc => ", objId);

  const URL = {
    uri: "/resources/6w/tags",
    otpCTX: "SecurityContext=preferred",
    optTenant: `tenant=${store.currentTenant}`,
  };
  const url = `${store._3DSpace}${URL.uri}?${URL.otpCTX}&${URL.optTenant}`;
  const dataTest = {
    tag: [
      {
        subject: [
          {
            uri: `pid://${objId}`,
          },
        ],
        predicate: listPredicates[pred],
        object: {
          literal: tag,
        },
      },
    ],
  };
  _httpCallAuthenticated(url, {
    method: "DELETE",
    data: JSON.stringify(dataTest),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json,text/javascript,*/*",
    },
  });
}

export function getInfoDoc(str = "") {
  console.log("getInfoDoc => ", str);
  const store = mainStore();
  const { _3DSpace } = store;
  if (str === "") return;
  console.log("infoDoc => ", str);
  const URL = {
    uri: "/enovia/resources/v1/modeler/documents",
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "application/json,text/javascript,*/*",
  };
  const url = `${_3DSpace}${URL.uri}`;
  console.log(url);
  const dataTest = `$include=none,lockerInfo,ownerInfo,originatorInfo,files,ownerInfo,originatorInfo&$fields=none,title,name,typeNLS,collabSpaceTitle,revision,isLatestRevision,files,lockStatus,lockerInfo.name,lockerInfo.firstname,lockerInfo.lastname,owner,ownerInfo.name,ownerInfo.firstname,ownerInfo.lastname,stateNLS,modified,policy,state,organizationTitle,originator,originatorInfo.name,originatorInfo.firstname,originatorInfo.lastname,hasModifyAccess,fileExtension,files.name,files.title,files.revision,files.locker,ownerInfo,ownerInfo.name,ownerInfo.firstname,ownerInfo.lastname,originatorInfo,originatorInfo.name,originatorInfo.firstname,originatorInfo.lastname&$ids=${str}`;

  _httpCallAuthenticated(url, {
    method: "POST",
    headers: headers,
    data: dataTest,
    onComplete(response) {
      console.log("response ", JSON.parse(response));
    },
    onFailure(err, header) {
      console.log(err, header.error);
    },
  });
}

export function getActualTagsOnDoc(obj) {
  const store = mainStore();
  const { listCTXs, currentTenant, currentUser, ctx } = store;
  console.log("ctx ", ctx);
  // const nomFichier = "beam_cube_TEST_BDD";
  console.log("obj ", obj);
  const nomFichier = obj.info.name;
  const URL = {
    baseUrl: `https://${currentTenant.toLowerCase()}-eu1-fedsearch.3dexperience.3ds.com`,
    uri: "/federated/search",
  };
  const url = `${URL.baseUrl}${URL.uri}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json,text/javascript,*/*",
  };

  const dataPattern = {
    with_indexing_date: true,
    with_synthesis: true,
    with_nls: false,
    label: `3DSearch-${currentUser.username}-AjoutDeTagBeam-${UUID()}`,
    locale: "fr",
    select_predicate: [
      "ds6w:label",
      "ds6w:type",
      "ds6w:description",
      "ds6w:identifier",
      "ds6w:modified",
      "ds6w:created",
      "ds6wg:revision",
      "ds6w:status",
      "ds6w:responsible",
      "owner",
      "ds6w:responsibleUid",
      "ds6wg:filesize",
      "ds6w:project",
      "ds6w:dataSource",
      "ds6w:community",
      "ds6w:originator",
      "dsgeo:referential",
      "ds6w:lastModifiedBy",
      "ds6w:repository",
      "dcterms:title",
      "dcterms:description",
      "ds6w:containerUid",
    ],
    with_synthesis_hierarchical: true,
    select_file: ["icon", "thumbnail_2d"],
    query: nomFichier,
    specific_source_parameter: {
      "3dspace": {
        additional_query:
          ' AND NOT (owner:"ENOVIA_CLOUD" OR owner:"Service Creator" OR owner:"Corporate" OR owner:"User Agent" OR owner:"SLMInstallerAdmin" OR owner:"Creator" OR owner:"VPLMAdminUser") AND (ds6w_58_islastrevisionperstate:true OR NOT listoffields:ds6w_58_islastrevisionperstate)',
      },
      drive: {
        additional_query:
          ' AND NOT ([flattenedtaxonomies]:"types/DriveNode" AND ( [current]:"Trashed" OR [policy]:"Drive File Iteration") )',
      },
    },
    select_exclude_synthesis: ["ds6w:what/ds6w:topic"],
    order_by: objToTag.order_by,
    order_field: "relevance",
    select_snippets: [
      "ds6w:snippet",
      "ds6w:label:snippet",
      "ds6w:responsible:snippet",
      "ds6w:community:snippet",
      "swym:message_text:snippet",
    ],
    nresults: 40,
    start: "0",
    source: sourcesSearching,
    tenant: currentTenant,
    login: {
      "3dspace": {
        SecurityContext: ctx,
      },
    },
  };
  console.log("dataPattern => ", dataPattern);
  _httpCallAuthenticated(url, {
    method: "POST",
    headers: headers,
    data: JSON.stringify(dataPattern),
    onComplete(response) {
      console.log("response ", JSON.parse(response));
    },
    onFailure(err) {
      console.log("Erreur de recuperation d'id du doc et des tags", err);
    },
  });
}
