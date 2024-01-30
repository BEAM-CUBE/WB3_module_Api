import { _httpCallAuthenticated } from "../main/3dexperience_api";
import { _3DSpace_get_docInfo } from "../main/3dspace_api";
import { UUID } from "../../api/index";

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

/**
 * @description La fonction `addTagToDoc` est utilisée pour ajouter une balise à un document dans un espace 3D en
 * utilisant les informations d'identification et les informations sur l'objet fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Object} credentials.currentUser.username - Le paramètre `currentUser` est un qui contient les informations de l'utilisateur qui envoie le message(appeler depuis la fonction `_3DSwym_get_currentuser`), une chaîne de caractère contenant le nom d'utilisateur.
 *
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex: R1132100968447)
 * @param {Object} obj - Le paramètre `obj` est un objet qui contient les propriétés suivantes :
 * @param {String} obj.info.name - L'identifiant de l'objet que vous souhaitez marquer. (ex: B70C12CDAE0415006579A93200061A14)
 * @param {String} obj.pred - La propriété de l'objet que vous souhaitez marquer. (ex: how, what, when, where, who, why)
 * @param {String} obj.tag - Le tag que vous souhaitez ajouter à l'objet.
 * @param {String} obj.order_by - L'ordre de la balise que vous souhaitez ajouter à l'objet. (ex: asc, desc)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque
 * l'opération de marquage sera terminée avec succès. La réponse du serveur lui sera transmise en
 * argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `addTagToDoc`. Il vous permet de gérer et de traiter
 * l'erreur de manière personnalisée.
 * @example credentials={space: "https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia", currentUser: { username: "Yan" }, tenant: "R1132100968447"}
 * @example obj={objId: "B70C12CDAE0415006579A93200061A14", pred: "what", tag: "testTag"}
 *
 */
export function addTagToDoc(
  credentials,
  obj,
  onDone = undefined,
  onError = undefined,
) {
  const { space, tenant } = credentials;
  const { objId, pred, tag } = obj;

  const URL = {
    uri: "/resources/6w/tags",
    otpCTX: "SecurityContext=preferred",
    optTenant: `tenant=${tenant}`,
  };
  const url = `${space}${URL.uri}?${URL.otpCTX}&${URL.optTenant}`;
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
      const resp = JSON.parse(response);
      const info = {};
      setTimeout(() => {
        _3DSpace_get_docInfo(
          credentials,
          objId,
          (rep) => {
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
            getActualTagsOnDoc(
              credentials,
              obj,
              (rep) => {
                if (onDone) onDone(rep);
              },
              (err) => {
                if (onError) onError(err);
              },
            );
          },
          (response, headers) => {
            const info = response;
            info["msg"] = headers.errormsg;
            info["errCode"] = headers.errorcode;
            console.log("❌ sendDirectMessage => ", info);
            if (onError) onError(info);
          },
        );
      }, 2000);
    },
    onFailure(response, headers) {
      const info = response;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;
      console.log("❌ sendDirectMessage => ", info);
      if (onError) onError(info);
    },
  });
}
/**
 * @description La fonction `getActualTagsOnDoc` récupère les balises réelles d'un document en utilisant les
 * informations d'identification et les informations sur l'objet fournies. Appeler depuis `addTagToDoc()`
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex: R1132100968447)
 * @param {Object} credentials.currentUser.username - Le paramètre `currentUser` est un qui contient les informations de l'utilisateur qui envoie le message(appeler depuis la fonction `_3DSwym_get_currentuser`).
 * @param {Object} credentials.ctx  - L'ID du contexte de travail.
 * @param obj - Le paramètre `obj` est un objet qui contient des informations sur le document. Il
 * possède les propriétés suivantes :
 * @param {String} obj.info.name - Le nom du document.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque
 * l'opération de marquage sera terminée avec succès. La réponse du serveur lui sera transmise en
 * argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `addTagToDoc`. Il vous permet de gérer et de traiter
 * l'erreur de manière personnalisée.
 */
export function getActualTagsOnDoc(
  credentials,
  obj,
  onDone = undefined,
  onError = undefined,
) {
  // const nomFichier = "beam_cube_TEST_BDD";
  console.log("obj ", obj);
  const nomFichier = obj.info.name;
  const URL = {
    baseUrl: `https://${credentials.tenant.toLowerCase()}-eu1-fedsearch.3dexperience.3ds.com`,
    uri: "/federated/search",
  };
  const url = `${URL.baseUrl}${URL.uri}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json,text/javascript,*/*",
  };
  const uuid = UUID();
  const dataPattern = {
    with_indexing_date: true,
    with_synthesis: true,
    with_nls: false,
    label: `3DSearch-${credentials.currentUser.username}-AjoutDeTagBeam-${uuid}`,
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
    tenant: credentials.tenant,
    login: {
      "3dspace": {
        SecurityContext: credentials.ctx,
      },
    },
  };
  console.log("dataPattern => ", dataPattern);
  _httpCallAuthenticated(url, {
    method: "POST",
    headers: headers,
    data: JSON.stringify(dataPattern),
    onComplete(response) {
      const info = JSON.parse(response);
      onDone(info);
    },
    onFailure(err, headers) {
      const info = err;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;
      console.log("❌ sendDirectMessage => ", info);
      if (onError) onError(info);
      console.log("Erreur de recuperation d'id du doc et des tags", err);
    },
  });
}

/**
 * @description La fonction `removeTagToDoc` est utilisée pour supprimer une balise spécifique d'un document en
 * utilisant les informations d'identification et les informations sur l'objet fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex: R1132100968447)
 *
 * @param {Object} obj - Le paramètre `obj` est un objet qui contient les propriétés suivantes :
 * @param {String} obj.objId - L'identifiant unique de l'objet pour lequel vous souhaitez supprimer la balise.
 * @param {String} obj.pred - L'identifiant de la relation entre l'objet et la balise. (ex: how, what, when, where, who, why).
 * @param {String} obj.tag - Le nom du tag à supprimer.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * suppression de la balise du document sera terminée avec succès. Il faut un argument, qui est la
 * réponse du serveur.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `removeTagToDoc`. Il vous permet de gérer et de traiter
 * l'erreur de manière personnalisée.
 */
export function removeTagToDoc(
  credentials,
  obj,
  onDone = undefined,
  onError = undefined,
) {
  const { objId, pred, tag } = obj;

  const URL = {
    uri: "/resources/6w/tags",
    otpCTX: "SecurityContext=preferred",
    optTenant: `tenant=${credentials.tenant}`,
  };
  const url = `${credentials.space}${URL.uri}?${URL.otpCTX}&${URL.optTenant}`;
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
    onComplete(response) {
      if (onDone) onDone(response);
    },
    onFailure(err, headers) {
      const info = err;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;
      console.log("❌ sendDirectMessage => ", info);
      if (onError) onError(info);
    },
  });
}

/**
 * @description La fonction « getInfoDocTags » effectue un appel HTTP pour récupérer des informations sur les
 * documents en fonction des informations d'identification et des identifiants de document fournis.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {String} [str] - Le paramètre `str` est une chaîne qui représente l'ID du documents pour lesquels
 * vous souhaitez récupérer des informations.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête HTTP sera terminée avec succès. Il prend un argument, qui correspond aux données de réponse
 * de la requête.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `getInfoDocTags`. Il vous permet de gérer et de traiter
 * les informations d'erreur.
 * @returns La fonction ne renvoie explicitement rien.
 */
export function getInfoDocTags(
  credentials,
  str = "",
  onDone = undefined,
  onError = undefined,
) {
  const { space } = credentials;
  if (str === "") return;

  const URL = {
    uri: "/enovia/resources/v1/modeler/documents",
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "application/json,text/javascript,*/*",
  };
  const url = `${space}${URL.uri}`;

  const dataTest = `$include=none,lockerInfo,ownerInfo,originatorInfo,files,ownerInfo,originatorInfo&$fields=none,title,name,typeNLS,collabSpaceTitle,revision,isLatestRevision,files,lockStatus,lockerInfo.name,lockerInfo.firstname,lockerInfo.lastname,owner,ownerInfo.name,ownerInfo.firstname,ownerInfo.lastname,stateNLS,modified,policy,state,organizationTitle,originator,originatorInfo.name,originatorInfo.firstname,originatorInfo.lastname,hasModifyAccess,fileExtension,files.name,files.title,files.revision,files.locker,ownerInfo,ownerInfo.name,ownerInfo.firstname,ownerInfo.lastname,originatorInfo,originatorInfo.name,originatorInfo.firstname,originatorInfo.lastname&$ids=${str}`;

  _httpCallAuthenticated(url, {
    method: "POST",
    headers: headers,
    data: dataTest,
    onComplete(response) {
      if (onDone) onDone(JSON.parse(response));
    },
    onFailure(err, header) {
      const info = err;
      info["msg"] = header.error;
      if (onError) onError(info);
    },
  });
}
