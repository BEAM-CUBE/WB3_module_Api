import {
  _httpCallAuthenticated,
  _getPlatformServices,
  _getPlateformInfos,
} from "./3dexperience_api";
import { chunkArray } from "../../utils/chunks";
import { UUID } from "../../api/index";
import { getCSRFToken } from "./getCSRFToken";
import { DateTime } from "luxon";

import qs from "querystring";

/**
 * @description La fonction `_3dSpace_get_docInfo` récupère des informations sur un document dans un espace 3D.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSapce) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}

 * @param {String} [docid] - Le paramètre `docid` est l'ID du document pour lequel vous souhaitez récupérer des
 * informations. C'est un paramètre obligatoire et doit être fourni.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque les
 * informations du document seront récupérées avec succès. Il prend un argument, qui est l'objet
 * d'informations du document.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'appel HTTP. Il prend un paramètre, qui est la réponse d'erreur.
 * @returns La fonction ne renvoie explicitement rien.
 */
export async function _3DSpace_get_docInfo(
  credentials,
  docid = undefined,
  onDone = undefined,
  onError = undefined
) {
  const _3DSpace = credentials.space;
  if (docid === undefined) {
    console.log("Le paramètre docid est obligatoire");
    return;
  }
  const url = _3DSpace + `/resources/v1/modeler/documents/${docid}`;
  _httpCallAuthenticated(url, {
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      if (onDone) onDone(info);
    },

    onFailure(response) {
      if (onError) onError(response);
    },
  });
}

export async function _3DSpace_get_multiDocInfo(
  credentials,
  docids = undefined,
  onDone = undefined,
  onError = undefined
) {
  const _3DSpace = credentials.space;
  if (docids === undefined) {
    console.log("Le paramètre docids est obligatoire");
    return;
  }
  // const url = _3DSpace + `/resources/v1/modeler/documents/ids?$fields=revision&$include=!files,!ownerInfo,!originatorInfo,versions`;

  let url =
    `${_3DSpace}/resources/v1/modeler/documents/ids` +
    "?$include=!files,!ownerInfo,!originatorInfo,!relOwnerInfo'";
  let data = qs.stringify({
    $ids: docids.toString().replace('"', "").replace("[", "").replace("]", ""),
  });
  _httpCallAuthenticated(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      if (onDone) onDone(info);
    },

    onFailure(response) {
      if (onError) onError(response);
    },
  });
}

/**
 * @description Cette fonction effectue un appel HTTP authentifié pour récupérer le jeton CSRF pour un document de
 * modélisation 3D.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.objID - ID du document pour lequel le jeton CSRF est demandé.
 * @param {Function} [onDone] - Le paramètre onDone est une fonction de rappel qui sera exécutée lorsque la
 * requête HTTP sera terminée avec succès. Il prend un argument, qui correspond aux données de réponse
 * renvoyées par le serveur.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera exécutée si la requête
 * HTTP échoue ou rencontre une erreur. Il prend un argument, qui est la réponse d'erreur.
 */
export function _3DSpace_get_csrf(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.objID && credentials.objID !== "") {
    let url = `${credentials.space}/resources/v1/modeler/documents/${credentials.objID}`;

    _httpCallAuthenticated(url, {
      onComplete(response, headers, xhr) {
        const info = JSON.parse(response);
        credentials["success"] = true;
        credentials["token"] = info?.csrf?.value;
        credentials["datas"] = info?.data[0];
        if (onDone) {
          onDone(credentials);
        }
      },

      onFailure(response) {
        if (onError) onError(response);
      },
    });
  } else {
    _3DSpace_csrf(
      credentials,
      (rep) => {
        console.log("_3DSpace_get_csrf / _3DSpace_csrf", rep);

        credentials["token"] = rep;
        if (onDone) onDone(credentials);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  }
}

/**
 * @description Cette fonction JavaScript récupère le TOKEN CSRF d'une application 3DSpace.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSapce) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {Function} onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le jeton
 * CSRF sera récupéré avec succès. Il faut un argument, qui est la valeur du jeton CSRF.
 * @param {Function} onError - Le paramètre `onError` est une fonction de rappel qui sera appelée si une erreur
 * survient lors de l'exécution de la fonction `_3DSpace_csrf`. Il est utilisé pour gérer et afficher
 * les messages d’erreur ou exécuter toute logique de gestion des erreurs nécessaire.
 * @returns la valeur du jeton CSRF, qui est obtenue à partir de la réponse de l'appel HTTP.
 */
export function _3DSpace_csrf(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (credentials.space) {
    const url = credentials.space + "/resources/v1/application/CSRF";
    _httpCallAuthenticated(url, {
      onComplete(response, headers, xhr) {
        const info = JSON.parse(response);

        if (onDone) onDone(info.csrf.value);
      },
      onFailure(response, headers, xhr) {
        if (onError)
          onError({
            response,
            headers,
            xhr,
          });
      },
    });
  } else {
    const msgError = "ERROR : url du 3DSpace non défini.";
    if (onError) onError(msgError);
  }
}

/**
 * @description La fonction `_3DSpace_get_ticket` récupère un ticket d’accès pour un document
 * 
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}

 * @param {String} credentials.objID - ID du document pour lequel l'URL du fichier est demandée.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque l'URL du fichier sera récupérée
 * avec succès. Il prend un paramètre, qui est l'URL du fichier.
 * @param {Function} [onError] - Le paramètre onError est une fonction qui sera appelée s'il y a une erreur lors
 * de l'exécution de la fonction. Il s'agit d'un paramètre facultatif et peut être laissé indéfini s'il
 * n'est pas nécessaire.
 */
export function _3DSpace_get_ticket(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  let url =
    credentials.space +
    `/resources/v1/modeler/documents/${credentials.objID}/files/DownloadTicket`;
  _3DSpace_get_csrf(
    credentials,
    (token) => {
      _httpCallAuthenticated(url, {
        method: "PUT",
        headers: {
          ENO_CSRF_TOKEN: credentials.token,
        },

        onComplete(response, headers) {
          let info = JSON.parse(response);

          const file_url = info.data[0].dataelements.ticketURL;

          if (onDone) onDone(file_url, headers);
        },

        onFailure(response, head) {
          console.warn("☠️ error => ", response, head);
          if (onError) onError(response, head);
        },
      });
    },
    (err) => {
      console.warn("_3DSpace_get_ticket / error => ", err);
      if (onError) onError(err);
    }
  );
}

/**
 * @description Cette fonction envoie une requête PUT à une URL spécifiée avec des en-têtes d'authentification et
 * renvoie une URL de fichier en cas de succès.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} [docid] - L'ID du document pour lequel le ticket de téléchargement de fichier est demandé.
 * @param {String} [csr] - Le paramètre "csr" est un jeton CSRF utilisé à des fins d'authentification et de
 * sécurité. Il est transmis en tant qu'en-tête dans la requête HTTP à l'URL spécifiée.
 * @param {Function} [onDone] - Le paramètre onDone est une fonction de rappel qui sera exécutée lorsque la
 * requête HTTP aboutira et que l'URL du fichier sera obtenue. Il prend un argument, qui est l'URL du
 * fichier.
 * @param {Function} [onError] - Le paramètre onError est une fonction de rappel qui sera exécutée s'il y a une
 * erreur lors de la requête HTTP. Il est facultatif et peut être laissé indéfini s'il n'est pas
 * nécessaire.
 */
export function _3DSpace_file_url_csr(
  credentials,
  docid,
  csr = undefined,
  onDone = undefined,
  onError = undefined
) {
  const url = `${credentials.space}/resources/v1/modeler/documents/${docid}/files/DownloadTicket`;
  if (!csr) {
    csr = credentials.token;
  }
  _httpCallAuthenticated(url, {
    method: "PUT",
    headers: {
      ENO_CSRF_TOKEN: csr,
    },

    onComplete(response) {
      let info = JSON.parse(response);
      console.log("☠️ info => ", info);
      if (info.success === true) {
        try {
          const file_url = info.data[0].dataelements.ticketURL;
          if (onDone) onDone(file_url);
        } catch (err) {
          if (onError) onError(err);
        }
      }
    },

    onFailure(response) {
      if (onError) onError(response);
    },
  });
}

/**
 * @description Cette fonction met à jour un fichier dans un espace 3D avec les données et le nom de fichier donnés,
 * en utilisant la protection CSRF.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} [docId] - ID de document du fichier d'espace 3D en cours de mise à jour.
 * @param {String} [fileId] - Le paramètre fileid est l'identifiant unique du fichier qui doit être mis à jour.
 * @param {String} [data] - Ce paramètre représente les données du fichier qui doivent être mises à jour. Il peut
 * se présenter sous la forme d'un format binaire ou texte.
 * @param {String} [filename] - Nom du fichier mis à jour.
 * @param {Function} [onDone] - Le paramètre onDone est une fonction de rappel qui sera exécutée lorsque
 * l'opération de mise à jour du fichier sera terminée avec succès.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera exécutée si une erreur
 * survient lors de l'exécution de la fonction `_3dspace_file_update`. Il permet de gérer les erreurs
 * de manière personnalisée, plutôt que de s'appuyer sur le comportement de gestion des erreurs par
 * défaut.
 */
export function _3DSpace_file_update(
  credentials,
  docId,
  fileId,
  data,
  filename,
  onDone = undefined,
  onError = undefined
) {
  const runFunction = () =>
    _3DSpace_file_update_csr(
      credentials,
      docId,
      fileId,
      data,
      filename,
      credentials.token,
      onDone,
      onError
    );

  if (credentials.token) {
    runFunction();
  } else {
    _3DSpace_get_csrf(
      credentials,
      docId,
      (result) => {
        console.log(
          "_3DSpace_file_update | _3DSpace_get_csrf| onDone | result",
          result
        );
        credentials["token"] = result;
        runFunction();
      },
      () => {
        if (onError) onError();
      }
    );
  }
}

/**
 * @description Cette fonction met à jour un fichier dans le document du 3DSpace à l'aide d'un jeton CheckinTicket et CSRF.
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} docId - ID du document en cours de mise à jour.
 * @param {String} fileId - ID du fichier mis à jour dans le document.
 * @param {String} data - Les données binaires du fichier en cours de mise à jour.
 * @param {String} filename - Nom du fichier mis à jour.
 * @param {String} csr - csr signifie Cross-Site Request Forgery token, qui est une mesure de sécurité utilisée
 * pour empêcher l'accès non autorisé aux applications Web. Il s'agit d'un jeton unique généré par le
 * serveur et envoyé au client, qui est ensuite inclus dans les requêtes ultérieures pour vérifier
 * l'authenticité de la requête. Dans cette fonction, le
 * @param {Function} [onDone] - Le paramètre onDone est une fonction de rappel qui sera exécutée lorsque la
 * fonction se terminera avec succès. Il prend la réponse comme argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de la requête HTTP. Il est facultatif et s'il n'est pas fourni, l'erreur sera traitée en
 * interne.
 */
export function _3DSpace_file_update_csr(
  credentials,
  docId,
  fileId,
  data,
  filename,
  csr,
  onDone = undefined,
  onError = undefined
) {
  const url =
    credentials.space +
    `/resources/v1/modeler/documents/files/CheckinTicket?tenant=${credentials.tenant.toUpperCase()}&e6w-lang=fr&e6w-timezone=-60&xrequestedwith=xmlhttprequest`;

  _httpCallAuthenticated(url, {
    method: "PUT",
    headers: {
      SecurityContext: encodeURIComponent("ctx::" + credentials.ctx),
      //ENO_CSRF_TOKEN: credentials.token,
    },
    data: JSON.stringify({
      csrf: {
        name: "ENO_CSRF_TOKEN",
        value: credentials.token,
      },
    }),
    type: "json",
    onComplete(response, headers, xhr) {
      const csrf = response.csrf;
      const info = response.data[0].dataelements;

      const formData = new FormData();

      let blobData;
      if (data instanceof Blob) {
        blobData = data;
      } else {
        blobData = new Blob([data], {
          type: "text/plain",
        });
      }

      formData.append(info.ticketparamname, info.ticket);
      formData.append("file_0", blobData, filename);

      const opts = {};
      opts.method = "POST";
      opts.data = formData;

      opts.onComplete = function (response) {
        //Update the FCS file receipt
        let tempId = "temp_" + Date.now();
        let options = {
          method: "PUT",
          headers: {
            SecurityContext: "ctx::" + credentials.ctx,
          },
          data: JSON.stringify({
            csrf,
            data: [
              {
                relateddata: {
                  files: [
                    {
                      dataelements: {
                        title: filename,
                        receipt: response,
                      },
                      updateAction: "REVISE",
                    },
                  ],
                },
                id: docId,
                updateAction: "NONE",
              },
            ],
          }),
          type: "json",
          onComplete(response) {
            if (onDone) onDone(response);
          },

          onFailure(response) {
            if (onError) onError(response);
          },
        };

        let upperTenant = credentials.tenant.toUpperCase();

        _httpCallAuthenticated(
          credentials.space +
            `/resources/v1/modeler/documents/?$include=versions&tenant=${credentials.tenant.toUpperCase()}&e6w-lang=fr&e6w-timezone=-60&xrequestedwith=xmlhttprequest`,
          options
        );
        // _httpCallAuthenticated(
        //   credentials.space +
        //     `/resources/v1/modeler/documents/?$include=versions&tenant=${upperTenant}&e6w-lang=en&e6w-timezone=-120&xrequestedwith=xmlhttprequest`,
        //   options
        // );
      };

      opts.onFailure = function (err) {
        if (onError) onError(err);
      };

      opts.timeout = 0;

      _httpCallAuthenticated(info.ticketURL, opts);
    },
  });
}

export async function _3DSpace_put_docInfo(
  credentials,
  docId,
  onDone = undefined,
  onError = undefined
) {
  const _space = credentials.space;
  const csr = credentials.token;
  const ctx = credentials.ctx;
  const description = credentials?.description;
  const title = credentials?.title;

  if (!docId) {
    console.warn("Error: docId undefined");
    if (onError) onError("Error: docId undefined");
    return;
  }

  let url = `${credentials.space}/resources/v1/modeler/documents/${docId}`;
  const data = JSON.stringify({
    data: [
      {
        dataelements: {
          description,
          title,
        },
      },
    ],
  });
  _httpCallAuthenticated(url, {
    method: "PUT",
    headers: {
      ENO_CSRF_TOKEN: credentials.token,
    },
    data,
    type: "json",
    onComplete(response) {
      if (onDone) onDone(response);
    },
    onFailure(err) {
      if (onError) onError(err);
    },
  });
}

/**
 * Uploads a file to the 3DSpace platform.
 *
 * @param {Object} credentials - The credentials object.
 * @param {string} credentials.tenant - The tenant name.
 * @param {string} credentials.cs_name - The collaboration space name.
 * @param {string} [fileName=undefined] - The name of the file to upload.
 * @param {Blob} [blobFile=undefined] - The file blob to upload.
 * @param {function} [onDone=undefined] - Callback function to execute on successful upload.
 * @param {function} [onError=undefined] - Callback function to execute on error.
 * @param {function} [onProgress=undefined] - Callback function to execute on upload progress.
 * @returns {Promise<void>} - A promise that resolves when the upload is complete.
 */
export async function _3DSpace_Upload_File(
  credentials, // { tenant, cs_name }
  fileName = undefined,
  blobFile = undefined,
  onDone = undefined,
  onError = undefined,
  onProgress = undefined
) {
  let { tenant, cs_name } = credentials;
  if (!tenant && !cs_name) {
    if (onError) onError("Credentials undefined");
    return;
  }
  if (!fileName && !blobFile) {
    if (onError) onError("Définition du fichier undefined");
    return;
  }
  //cs_name = encodeURIComponent(cs_name);
  const timeStamp = DateTime.now().ts;

  //NOTE - Get Ticket
  let url = `https://${tenant.toLowerCase()}-eu1-space.3dexperience.3ds.com/enovia/resources/enocsmrest/collabspaces/${encodeURIComponent(
    cs_name
  )}/ticket?id=${timeStamp}&tenant=${tenant.toUpperCase()}&xrequestedwith=xmlhttprequest`;

  _httpCallAuthenticated(
    `https://${tenant.toLowerCase()}-eu1-space.3dexperience.3ds.com/enovia/resources/enocsmrest/session?tenant=${tenant.toUpperCase()}&xrequestedwith=xmlhttprequest`,
    {
      method: "GET",
      onComplete(response) {
        try {
          response = JSON.parse(response);
          const { csrftoken, isadmin } = response;
          if (csrftoken)
            _httpCallAuthenticated(url, {
              method: "GET",
              headers: {
                //"x-ds-csrftoken": csrftoken,
                Accept: "application/json",
              },

              onComplete(response, headers, xhr) {
                try {
                  response = JSON.parse(response);
                  if (response?.ticket) {
                    const { ticket, actionurl, jobticket } = response;

                    pushFileInFcs(
                      { dataelements: { ticket, ticketURL: actionurl } },
                      blobFile,
                      fileName,
                      (response) => {
                        let doc = new DOMParser().parseFromString(
                          response,
                          "text/html"
                        );
                        const receipt = doc.body.firstChild
                          .querySelector("input")
                          .getAttributeNode("value").value;

                        const urlRelatedFile = `https://${tenant.toLowerCase()}-eu1-space.3dexperience.3ds.com/enovia/resources/enocsmrest/collabspaces/${encodeURIComponent(
                          cs_name
                        )}/contents?receipt=${encodeURIComponent(receipt)}`;

                        let re = /(?:\.([^.]+))?$/;
                        let ext = re.exec(fileName)[1];

                        const bodyRequest = JSON.stringify({
                          actions: [],
                          businessobj: {
                            description: credentials?.description
                              ? credentials?.description
                              : "",
                            file: fileName,
                            fullnameowner: "",
                            icon: "",
                            maturity: "",
                            modified: "",
                            owner: {},
                            thumbnail: "",
                            title: ext
                              ? fileName.split(".").slice(0, -1).join(".")
                              : fileName,
                            type: {},
                          },
                          collabspace: cs_name,
                        });
                        _httpCallAuthenticated(urlRelatedFile, {
                          method: "POST",
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json;charset=UTF-8",
                            "X-DS-CSRFTOKEN": csrftoken,
                          },
                          data: bodyRequest,
                          type: "json",
                          onComplete(response, headers, xhr) {
                            // console.log("_3DSpace_Upload_Doc | pushFileInFcs | onComplete", response);
                            if (onDone) onDone(response);
                          },
                          onFailure(err) {
                            console.warn(
                              "_3DSpace_Upload_Doc | pushFileInFcs | onFailure",
                              { url: urlRelatedFile, bodyRequest, err }
                            );
                            if (onError) onError(err);
                          },
                        });
                      },
                      (err) => {
                        console.warn("pushFileInFcs", err);
                        if (onError) onError(err);
                      },
                      (progress) => {
                        if (onProgress) onProgress({ fileName, progress });
                      }
                    );
                  }
                } catch (error) {
                  if (onError) onError(error);
                }
              },
              onFailure(response) {
                console.warn("_3DSpace_Upload_Doc | onFailure");
                if (onError) onError(response);
              },
            });
        } catch {
          if (onError) onError();
        }
      },
      onFailure(err) {
        if (onError) onError(err);
      },
    }
  );
}

export async function _3DSpace_Update_Doc(
  credentials,
  objectId,
  data,
  onDone = undefined,
  onError = undefined
) {
  const _space = credentials.space;
  const csr = credentials.token;
  const ctx = credentials.ctx;

  //TEST de la Typo de Data (si Object, Blod, String)

  _3DSpace_get_docInfo(
    credentials,
    objectId,
    (info) => {
      const fileId = info.data[0].relateddata.files[0].id;
      const filename = info.data[0].relateddata.files[0].dataelements.title;

      _3DSpace_file_update(
        credentials,
        objectId,
        fileId,
        data,
        filename,
        (result) => {
          if (onDone) onDone(result);
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

/**
 * @description Cette fonction crée un document dans le 3Dspace à partir des données fournies au format JSON.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token », « space » et « ctx ».(ex: credentials.space, credentials.tenant, credentials.token)
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} credentials.ctx - L'ID du contexte de travail.
 * @param {String}[data] - Le paramètre data correspond aux données JSON qui doivent être chargées dans le 3Dspace.
 *
 * @param {String}[filename] - Le nom du fichier à créer.
 * @param {String}[desc] - desc est un paramètre de chaîne qui représente la description du document en cours de création dans le 3Dspace.
 *
 * @param {Function}[onDone] - Le paramètre onDone est une fonction de rappel qui sera appelée lorsque la requête HTTP sera terminée avec succès. Il prend la réponse comme argument.
 *
 * @param {Function}[onError] - Le paramètre onError est une fonction de rappel qui sera appelée s'il y a une erreur lors de l'exécution de la fonction _3dSpace_Create_Doc. Il prend l'objet de réponse comme argument.
 *
 */
export async function _3DSpace_Create_Doc(
  credentials,
  data, // data
  filename, //ref coclico
  descriptionDoc, // ref name
  onDone = undefined,
  onError = undefined
) {
  checkinTicket(
    credentials,
    (resultCheckinTicket) => {
      if (resultCheckinTicket?.items >= 1) {
        resultCheckinTicket.data.forEach((fcs__jobTicket) => {
          pushFileInFcs(
            fcs__jobTicket,
            data,
            filename,
            (receipt) => {
              relatedDocAndFile(
                credentials,
                receipt,
                filename,
                descriptionDoc,
                (response) => {
                  if (response?.data.length) {
                    if (onDone) onDone(response);
                  } else {
                    if (onError)
                      onError({
                        success: false,
                        msg: "Erreur lors de la mise en ralation entre la document et le fichier",
                      });
                  }
                },
                (err) => console.warn(err)
              );
            },
            (err) => console.warn(err)
          );
        });
      }
    },
    (err) => console.warn(err)
  );
}

function checkinTicket(credentials, onDone = undefined, onError = undefined) {
  if (credentials?.space && credentials.token && credentials.ctx) {
    let url = `${credentials.space}/resources/v1/modeler/documents/files/CheckinTicket`;

    _httpCallAuthenticated(url, {
      method: "PUT",
      headers: {
        ENO_CSRF_TOKEN: credentials.token,
        Accept: "application/json",
        "Content-Type": "application/json",
        SecurityContext: credentials.ctx,
      },

      onComplete(response, headers, xhr) {
        try {
          response = JSON.parse(response);
        } catch (error) {
          //
        }
        if (onDone) onDone(response);
      },
      onFailure(err) {
        if (onError) onError(err);
      },
    });
  } else {
    console.log("Error de credentials", credentials);
  }
}

function pushFileInFcs(
  fcs__jobTicket,
  fileData,
  fileName,
  onDone = undefined,
  onError = undefined,
  onProgress = undefined
) {
  console.log("pushFileInFcs", { fcs__jobTicket, fileData, fileName });
  let formData = new FormData();
  if (!(fileData instanceof Blob)) {
    fileData = new Blob([fileData], {
      type: "text/plain",
    });
  }
  formData.append("__fcs__jobTicket", fcs__jobTicket.dataelements.ticket);
  formData.append("file-name", fileName);
  formData.append("file_0", fileData, fileName);
  formData.append("file-title", fileName);
  formData.append("file-description", fileName);

  let url = fcs__jobTicket.dataelements.ticketURL;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      if (onProgress) onProgress(percentComplete);
    }
  };
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (onDone) onDone(xhr.responseText.replace(/[\n\r]/g, ""));
    } else {
      if (onError) onError(xhr.statusText);
    }
  };
  xhr.onerror = function () {
    if (onError) onError(xhr.statusText);
  };
  xhr.send(formData);
}

function relatedDocAndFile(
  credentials,
  receipt,
  filename,
  descriptionDoc = undefined,
  onDone = undefined,
  onError = undefined
) {
  console.log("relatedDocAndFile", { credentials, receipt, filename });
  const trimExt = (name) =>
    name.indexOf(".") === -1 ? name : name.split(".").slice(0, -1).join(".");
  let tempId = "temp_" + DateTime.now().ts;
  let url =
    credentials.space +
    "/resources/v1/modeler/documents/?e6w-lang=fr&e6w-timezone=-120&xrequestedwith=xmlhttprequest";
  _httpCallAuthenticated(url, {
    method: "POST",
    headers: {
      ENO_CSRF_TOKEN: credentials.token,
      SecurityContext: encodeURIComponent("ctx::") + credentials.ctx,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      csrf: { name: "ENO_CSRF_TOKEN", value: credentials.token },
      data: [
        {
          type: "Document",
          dataelements: {
            title: trimExt(filename),
            description: descriptionDoc,
          },
          relateddata: {
            files: [
              {
                dataelements: {
                  title: filename,
                  receipt: `${receipt}\n`,
                },
              },
            ],
          },
          tempId,
        },
      ],
    }),
    onComplete(response) {
      try {
        response = JSON.parse(response);
      } catch (error) {
        //
      }
      if (onDone) onDone(response);
    },
    onFailure(err) {
      if (onError) onError(err);
    },
  });
}

/**
 * @description Cette fonction récupère les contextes de sécurité basés sur des paramètres spécifiés à partir d'un
 * hôte donné.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 *@param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} [cs] - Le titre d'un espace de collaboration.
 * @param {String} [role] - Le paramètre de rôle est un paramètre facultatif qui spécifie le rôle de
 * l'utilisateur dans l'espace de collaboration. Si fourni, la fonction filtrera les espaces de
 * collaboration pour trouver celui où l'utilisateur a le rôle spécifié. S'il n'est pas fourni, la
 * fonction utilisera le premier espace de collaboration trouvé.
 * @param {String} [organization] - Nom de l'organisation pour laquelle le contexte de sécurité est récupéré.
 * @param {Function} [onDone] - La fonction à appeler lorsque le contexte de sécurité a été récupéré avec succès.
 * Il prend le contexte comme paramètre.
 * @param {Function} [onError] - Le paramètre onError est une fonction de rappel qui est appelée si une erreur se
 * produit lors de l'exécution de la fonction. Il prend un argument, qui est le message d'erreur ou
 * l'objet.
 */
export function _3DSpace_get_securityContexts(
  credentials,
  cs = undefined,
  role = undefined,
  organization = undefined,
  onDone = undefined,
  onError = undefined,
  withPreferredCredentials = false
) {
  const url =
    `${credentials.space}/resources/modeler/pno/person?` +
    "current=true" +
    "&select=preferredcredentials" +
    "&select=collabspaces";

  _httpCallAuthenticated(url, {
    method: "GET",
    onComplete(response) {
      // role.company.cs
      const contexts = JSON.parse(response);
      let context = "";
      let finalCs,
        finalOrg,
        finalRole = undefined;
      if (cs) {
        let oCS = contexts.collabspaces.find((e) => e.title === cs);
        if (oCS) {
          finalCs = cs;
          let couples = oCS.couples;
          couples = couples.filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.organization.pid === value.organization.pid &&
                  t.role.pid === value.role.pid
              )
          );
          if (role) {
            if (Array.isArray(role)) {
              role.forEach((r) => {
                if (!finalRole)
                  couples.forEach((e) => {
                    if (
                      r === e.role.name &&
                      organization === e.organization.title
                    ) {
                      finalRole = r;
                      finalOrg = organization;
                    } else if (r === e.role.name) {
                      let defineSingleItem = couples.filter(
                        (couple) => couple.role.name === r
                      );
                      if (defineSingleItem.length === 1) {
                        finalRole = defineSingleItem[0].role.name;
                        finalOrg = defineSingleItem[0].organization.title;
                      } else {
                        onError(defineSingleItem);
                      }
                    }
                  });
              });
            } else {
              couples.forEach((e) => {
                if (
                  role === e.role.name &&
                  organization === e.organization.title
                ) {
                  finalRole = role;
                  finalOrg = organization;
                } else if (role === e.role.name) {
                  let defineSingleItem = couples.filter(
                    (couple) => couple.role.name === role
                  );
                  if (defineSingleItem.length === 1) {
                    finalRole = defineSingleItem[0].role.name;
                    finalOrg = defineSingleItem[0].organization.title;
                  } else {
                    onError(defineSingleItem);
                  }
                }
              });
            }
          }
        }
      }
      if (finalCs && finalOrg && finalRole) {
        context = finalRole + "." + finalOrg + "." + finalCs;
        onDone(context);
        // onDone(encodeURI(context));
      } else {
        if (contexts.preferredcredentials && withPreferredCredentials) {
          context =
            contexts.preferredcredentials.role.name +
            "." +
            contexts.preferredcredentials.organization.title +
            "." +
            contexts.preferredcredentials.collabspace.title;
          onDone(context);
        } else {
          if (onError) {
            context = finalRole + "." + finalOrg + "." + finalCs;
            onError(context);
          }
        }
      }
    },
    onFailure(err, headers) {
      console.warn("Erreur de récupération du contexte de sécurité. => ", {
        err,
        headers,
      });
    },
  });
}

/**
 * @description La fonction `_3dspace_download_doc` est une fonction asynchrone qui télécharge un document à partir d'un espace 3D, avec des rappels facultatifs pour le succès et la gestion des erreurs.
 * @param {Object} credentials Un objet contenant les informations d'identification nécessaires à
 * l'authentification. Il doit avoir les propriétés suivantes: space, token
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}

 * @param  {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} credentials.objID - Le paramètre objectId est l'identifiant unique du document que vous souhaitez
 * télécharger depuis le 3DSpace.
 * @param {String} credentials.returnType -  "blob" - type d'object à retourner.
 * @param {Function} onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le
 * téléchargement sera terminé avec succès. Il prend un argument, qui est les données de réponse du
 * téléchargement.
 * @param {Function} onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3dspace_download_doc`. Il vous permet de gérer et de
 * répondre à toutes les erreurs qui se produisent.
 
 * @returns {Promise}
 */
export async function _3DSpace_download_doc(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  if (!credentials.objID || credentials.objID === "") {
    console.warn(
      "_3DSpace_download_doc() / Le paramètre objectId est obligatoire"
    );
    if (onError)
      onError(
        "_3DSpace_download_doc() / Le paramètre objectId est obligatoire"
      );
  }

  if (credentials.space === "" || !credentials.space) {
    console.warn(
      "_3DSpace_download_doc() / Le paramètre space est obligatoire"
    );
    if (onError)
      onError("_3DSpace_download_doc() / Le paramètre space est obligatoire");
  }
  if (credentials.token === "" || !credentials.token) {
    getCSRFToken(
      credentials,
      (rep) => {
        credentials["token"] = rep;
      },
      (err) => {
        console.log("☠️ error => ", err);
      }
    );
    // console.warn(
    //   "_3DSpace_download_doc() / Le paramètre token est obligatoire",
    // );
  }

  return new Promise((resolve, reject) => {
    _3DSpace_get_ticket(
      credentials,
      (ticketURL) => {
        if (credentials?.returnType === "blob") {
          console.log("ticketURL blob", ticketURL);
          fetch(ticketURL)
            .then((response) => response.blob())
            .then((blob) => {
              if (onDone) onDone(blob);
            })
            .catch((err) => {
              if (onError) onError(err);
            });
        } else {
          _httpCallAuthenticated(ticketURL, {
            onComplete(response) {
              let tryParse;
              try {
                tryParse = JSON.parse(response);
              } catch (error) {
                tryParse = response;
              }

              if (onDone && typeof onDone === "function") onDone(tryParse);
              resolve(tryParse);
            },
            onFailure(error, headers, xhr) {
              if (onError) {
                console.log("error http", error);
                onError({
                  msg: JSON.parse(error),
                  headers,
                  xhr,
                });
                reject({
                  msg: JSON.parse(error),
                  headers,
                  xhr,
                });
              }
            },
          });
        }
      },
      (error) => {
        if (onError) onError(error);
        console.log("*_3dspace_download_doc / error file URL *", error);
        reject(error);
      }
    );
  });
}

/**
 * @description La fonction `_3DSpace_download_multidoc` télécharge plusieurs documents à partir d'un espace 3D en
 * utilisant un token et des objectID donnés.
 * @param {Object} credentials - Un objet contenant les informations d'identification nécessaires à
 * l'authentification dans une fonction interne(_3DSpace_get_downloadTicket_multidoc). Il doit avoir les propriétés suivantes: space, token, tenant
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant 
 * @example {tenant:"R1132100968447"}
 * @param {String} [credentials.token] - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)

 * @param {String} [objectIds] - Un tableau d'ID d'objet qui doivent être téléchargés à partir du 3DSpace.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le
 * processus de téléchargement sera terminé avec succès. Il faut un argument, qui est le résultat du
 * processus de téléchargement.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur pendant le processus de téléchargement. Il vous permet de gérer les erreurs qui surviennent
 * lors du téléchargement.

 */
export async function _3DSpace_download_multidoc(
  credentials,
  objectIds,
  onDone = undefined,
  onError = undefined
) {
  if (
    typeof objectIds !== "undefined" &&
    Array.isArray(objectIds) &&
    objectIds?.length > 0
  ) {
    const datas = {
      credentials,
      myArray: objectIds,
      chunk: 80,
      fn_to_call: _3DSpace_get_downloadTicket_multidoc,
    };

    chunkArray(datas, (rep) => {
      if (onDone) onDone(rep);
    });
  } else {
    console.warn(
      "La liste d'objects dans la fonction _3DSpace_download_multidoc est vide ou non défini."
    );
    if (onError)
      onError(
        "La liste d'objects dans la fonction _3DSpace_download_multidoc est vide ou non défini."
      );
  }
}

/**
 * @description La fonction `_3dspace_get_downloadTicket_multidoc` permet de récupérer un ticket de téléchargement
 * de plusieurs documents dans un espace 3D.
 * @param {Object} [credentials] - Un objet contenant les informations d'identification nécessaires à
 * l'authentification. Il doit avoir les propriétés suivantes: space, token, tenant
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant
 * @example {tenant:"R1132100968447"}
 * @param {String} [credentials.token] - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} [objectIds] - Tableau d'ID d'objet pour lesquels le ticket de téléchargement doit être généré.
 * @param {Function} [onNext] - Une fonction de rappel qui sera appelée après chaque demande de ticket de
 * téléchargement réussie pour chaque objectId.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le
 * processus de téléchargement de chaque objet sera terminé avec succès. Il lui sera transmis un objet
 * contenant « objectId », « fileName » et « data » du fichier téléchargé.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction. Il est facultatif et peut être utilisé pour gérer les
 * erreurs qui surviennent.
 */
export function _3DSpace_get_downloadTicket_multidoc(
  credentials,
  objectIds,
  onNext = undefined,
  onDone = undefined,
  onError = undefined
) {
  const compilData = [];
  objectIds.forEach((objectId) => {
    compilData.push({
      id: objectId,
    });
  });
  let data = JSON.stringify({
    csrf: {
      name: "ENO_CSRF_TOKEN",
      value: credentials.token,
    },
    data: compilData,
  });

  const url = `${credentials.space}/resources/v1/modeler/documents/DownloadTicket?tenant=${credentials.tenant}&e6w-lang=fr&e6w-timezone=-120`;
  _httpCallAuthenticated(url, {
    method: "PUT",
    data,
    type: "json",
    onComplete(response) {
      const datas = response.data;
      if (response.success === true) {
        if (onNext) onNext();
        datas.forEach((data) => {
          try {
            const fileName = data.dataelements.fileName;
            const fileUrl = data.dataelements.ticketURL;

            _httpCallAuthenticated(fileUrl, {
              onComplete: (response, headers) => {
                let tryParse;
                try {
                  tryParse = JSON.parse(response);
                } catch (error) {
                  tryParse = response.blob();
                }
                if (onDone)
                  onDone({
                    objectId: data.id,
                    headers,
                    fileName,
                    data: tryParse,
                  });
              },
              onFailure: (error) => {
                console.log("error http", error);
              },
            });
          } catch (err) {
            console.log(err);
            if (onError) onError(err);
          }
        });
      }
    },
    onFailure(response) {
      console.log(response);
      if (onError) onError(response);
    },
  });
}

// MATURITY
/**
 * @description Cette fonction JavaScript récupère les prochains états possibles pour un objet donné dans un espace
 * 3D.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space » et « ctx ».
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} credentials.ctx - L'ID du contexte de travail.
 * @param {String} objectId - Le paramètre `objectId` est l'identifiant de l'objet dont vous souhaitez récupérer
 * les prochains états. Il est utilisé pour spécifier l'objet pour lequel vous souhaitez obtenir les
 * états suivants dans l'espace 3D.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque la demande sera terminée avec
 * succès. Il recevra la réponse en paramètre.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction. Il s'agit d'un paramètre facultatif, donc s'il n'est pas
 * fourni, il sera par défaut «non défini».
 * @return {Promise}
 */
export function _3DSpace_lifecycle_getNextStates(
  credentials,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  return new Promise((result) => {
    if (credentials.token === "") {
      _3DSpace_csrf(credentials);
    }
    if (objectId !== undefined && objectId !== "" && objectId !== null) {
      const url = `${credentials.space}/resources/v1/modeler/dslc/maturity/getNextStates`;

      let options = {
        method: "POST",
        headers: {
          SecurityContext: "ctx::" + credentials.ctx,
          ENO_CSRF_TOKEN: credentials.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          data: [
            {
              id: objectId,
            },
          ],
        }),
        type: "json",
        onComplete(response) {
          if (onDone) onDone(response);
        },
        onFailure(response) {
          if (onError) onError(response);
        },
      };
      _httpCallAuthenticated(url, options);
    }
  });
}
/**
 * @description Cette fonction permet de changer l'état d'un objet dans un espace 3D.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space » et « ctx ».
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} credentials.ctx - L'ID du contexte de travail.
 * @param {String} objectId - Le paramètre objectId est l'identifiant de l'objet dont l'état doit être modifié.
 * Il s'agit d'un identifiant unique qui représente un objet spécifique dans le système.
 * @param {Function} [nextState] - Le paramètre `nextState` est l'état souhaité vers lequel vous souhaitez modifier
 * l'objet. Il représente l'état suivant du cycle de vie de l'objet.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque l'opération de changement d'état
 * sera terminée avec succès. Il prend la réponse comme argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3dspace_lifecyle_changeState`. C'est un paramètre
 * facultatif, donc s'il n'est pas fourni, la fonction ne fera rien en cas de problème.
 * @returns une promesse.
 */
export function _3DSpace_lifecycle_changeState(
  credentials,
  objectId,
  nextState,
  onDone = undefined,
  onError = undefined
) {
  return new Promise((result) => {
    if (credentials.token === "") {
      _3DSpace_csrf(credentials);
    }
    if (objectId !== undefined && objectId !== "" && objectId !== null) {
      const url = `${credentials.space}/resources/v1/modeler/dslc/maturity/changeState`;

      let options = {
        method: "POST",
        headers: {
          SecurityContext: "ctx::" + credentials.ctx,
          ENO_CSRF_TOKEN: credentials.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          data: [
            {
              id: objectId,
              nextState,
            },
          ],
        }),
        type: "json",
        onComplete(response) {
          if (onDone) onDone(response);
        },
        onFailure(response) {
          if (onError) onError(response);
        },
      };
      _httpCallAuthenticated(url, options);
    }
  });
}
// RESERVATION
//TODO -
function _3DSpace_lifecyle_reserve(
  host,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  // ...
}
//TODO -
function _3DSpace_lifecyle_unreserve(
  host,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  // ...
}
// SHARING
//TODO -
function _3DSpace_lifecyle_getSharing(
  host,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  // ...
}
//TODO -
function _3DSpace_lifecyle_setSharing(
  host,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  // ...
}
// VERSIONING
/**
 * @description La fonction `_3DSpace_lifecycle_getGraph` récupère un graphique du cycle de vie d'un objet spatial
 * 3D à l'aide des informations d'identification et de l'ID d'objet fournis.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier la demande.
 *  Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant
 * @example {tenant:"R1132100968447"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} credentials.ctx - L'ID du contexte de travail.
 * @param {String} objectId - Le paramètre objectId est l'identifiant de l'objet pour lequel vous souhaitez
 * récupérer le graphique. Il est utilisé pour spécifier l'objet pour lequel vous souhaitez obtenir le
 * graphique de version.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque la récupération du graphique sera
 * réussie. Il prend la réponse comme argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSpace_lifecycle_getGraph`. C'est un paramètre
 * facultatif, donc s'il n'est pas fourni, la fonction ne fera rien en cas d'erreur.
 * @returns une promesse.
 */
export function _3DSpace_lifecycle_getGraph(
  credentials,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  // A VALIDER
  return new Promise((result) => {
    if (credentials.token === "") {
      _3DSpace_csrf(credentials);
    }
    if (objectId !== undefined && objectId !== "" && objectId !== null) {
      const url = `${credentials.space}/resources/v1/dslc/versiongraph?withThumbnail=0&withIsLastVersion=0&withAttributes=0&withCopyFrom=0&tenant=${credentials.tenant}`;

      _3DSpace_get_securityContexts(
        credentials.space,
        "ESPACE COMMUN",
        ["VPLMProjectLeader", "VPLMCreator"],
        undefined,
        (ctx) => (credentials["ctx"] = ctx),
        (err) => {
          console.log("onError =>", err);
        }
      );
      let options = {
        method: "POST",
        headers: {
          securitycontext: "ctx::" + credentials.ctx,
          ENO_CSRF_TOKEN: credentials.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          graphRequests: [
            {
              id: objectId,
            },
          ],
        }),
        type: "json",
        onComplete(response) {
          if (onDone) onDone(response);
        },
        onFailure(response) {
          if (onError) onError(response);
        },
      };
      _httpCallAuthenticated(url, options);
    }
  });
}
// REVISION
/**
 * @description La fonction `_3DSpace_lifecycle_getNextRevision` permet de récupérer la prochaine révision d'un
 * document dans un espace 3D.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant
 * @example {tenant:"R1132100968447"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} credentials.ctx - L'ID du contexte de travail.
 * @param {String} objectId - Le paramètre `objectId` est l'identifiant unique de l'objet pour lequel vous
 * souhaitez obtenir la prochaine révision. Il est utilisé pour spécifier l'objet qui doit être révisé.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque l'opération sera terminée avec
 * succès. Il prend la réponse comme argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSpace_lifecycle_getNextRevision`. Il s'agit d'un
 * paramètre facultatif, donc s'il n'est pas fourni, il sera par défaut «non défini».
 * @returns Une promesse est renvoyée.
 */
export function _3DSpace_lifecycle_getNextRevision(
  credentials,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  return new Promise((result) => {
    if (credentials.token === "") {
      _3DSpace_csrf(credentials);
    }
    if (objectId !== undefined && objectId !== "" && objectId !== null) {
      const url = `${credentials.space}/resources/lifecycle/revise/prepare_revise_maskattributes?tenant=${credentials.tenant}`;

      _3DSpace_get_securityContexts(
        credentials.space,
        "ESPACE COMMUN",
        ["VPLMProjectLeader", "VPLMCreator"],
        undefined,
        (ctx) => (credentials["ctx"] = ctx),
        (err) => {
          console.log("onError =>", err);
        }
      );
      let options = {
        method: "POST",
        headers: {
          SecurityContext: "ctx::" + credentials.ctx,
          ENO_CSRF_TOKEN: credentials.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          data: [
            {
              "attribute[PLMReference.V_versionComment]": null,
              physicalid: objectId,
              type: "Document",
              tenant: credentials.tenant,
              objectId,
              policy: "Document Release",
              availableSemantic: ["E", "LAST", "NEW", "DUP"],
            },
          ],
        }),
        type: "json",
        onComplete(response) {
          if (onDone) onDone(response);
        },
        onFailure(response) {
          if (onError) onError(response);
        },
      };
      _httpCallAuthenticated(url, options);
    }
  });
}
/**
 * @description La fonction `_3DSpace_lifecycle_changeRevision` est utilisée pour changer la révision d'un objet
 * dans un espace 3D.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant
 * @example {tenant:"R1132100968447"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {String} credentials.ctx - L'ID du contexte de travail.
 * @param {String} objectId - Le paramètre objectId représente l'identifiant unique de l'objet dans l'espace 3D.
 * Il est utilisé pour spécifier quelle révision de l'objet doit être modifiée.
 * @param {Function} nextRevision - Le paramètre `nextRevision` est le numéro de révision qui sera attribué à
 * l'objet après le changement de révision.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque l'opération sera terminée avec
 * succès. Il prend la réponse comme argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSpace_lifecycle_changeRevision`. Il vous permet de
 * gérer toutes les erreurs qui se produisent et d’effectuer toute gestion ou journalisation des
 * erreurs nécessaire.
 * @returns une promesse.
 */
export function _3DSpace_lifecycle_changeRevision(
  credentials,
  objectId,
  nextRevision,
  onDone = undefined,
  onError = undefined
) {
  return new Promise((result) => {
    if (credentials.token === "") {
      _3DSpace_csrf(credentials);
    }
    if (objectId !== undefined && objectId !== "" && objectId !== null) {
      const url = `${credentials.space}/resources/lifecycle/revise/major?tenant=${credentials.tenant}`;

      _3DSpace_get_securityContexts(
        credentials.space,
        "ESPACE COMMUN",
        ["VPLMProjectLeader", "VPLMCreator"],
        undefined,
        (ctx) => (credentials["ctx"] = ctx),
        (err) => {
          console.log("onError =>", err);
        }
      );
      let options = {
        method: "POST",
        headers: {
          securitycontext: "ctx::" + credentials.ctx,
          ENO_CSRF_TOKEN: credentials.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          data: [
            {
              physicalid: objectId,
              proposedRevision: nextRevision,
              modifiedAttributes: {
                revision: nextRevision,
              },
            },
          ],
          folderid: null,
          notificationTimeout: 600,
        }),
        type: "json",
        onComplete(response) {
          if (onDone) onDone(response);
        },
        onFailure(response) {
          if (onError) onError(response);
        },
      };
      _httpCallAuthenticated(url, options);
    }
  });
}

export function _3DSpace_get_currentSecurityContext(credentials) {
  return new Promise((resolve, reject) => {
    const url = `${
      credentials.space
    }/resources/pno/person/getsecuritycontext&tenant=${credentials.tenant.toUpperCase()}&xrequestedwith=xmlhttprequest`;

    let options = {
      method: "GET",
      onComplete(response) {
        resolve(response);
      },
      onFailure(response) {
        reject(response);
      },
    };

    _httpCallAuthenticated(url, options);
  });
}

export function _3DSpace_lifecycle_getRevisions(
  credentials,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  return new Promise(async (resolve, reject) => {
    const { tenant, ctx, space } = credentials;
    if (!tenant || !ctx || !space) {
      reject({ error: "Erreur de credentials", tenant, ctx, space });
    }
    const url = `${
      credentials.space
    }/resources/v1/dslc/versiongraph?withThumbnail=0&withIsLastVersion=1&withAttributes=1&withCopyFrom=1&tenant=${credentials.tenant.toUpperCase()}&xrequestedwith=xmlhttprequest`;
    let SecurityContext;
    await _3DSpace_get_currentSecurityContext(credentials).then(
      (result) => (SecurityContext = result?.SecurityContext)
    );

    let options = {
      method: "POST",
      headers: {
        securitycontext: "ctx::" + SecurityContext,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        graphRequests: [
          {
            id: objectId,
            attributes: ["revision", "policy"],
          },
        ],
      }),
      type: "json",
      onComplete(response) {
        if (onDone) onDone(response);
        resolve(response);
      },
      onFailure(response) {
        if (onError) onError(response);
        reject(response);
      },
    };

    _httpCallAuthenticated(url, options);
  });
}
// SECTION: BOOKMARKS

export function _3DSpace_getBookmarksRoot(
  credentials,
) {
  return new Promise((resolve, reject) => {
    const { _fedSearch, currentTenant, ctx } = credentials;
    if(!ctx) reject({success:false, msg:"getBookmarksRoot: ctx is missing in credentials"});
    if(!_fedSearch) reject({success:false, msg:"getBookmarksRoot: _fedSearch is missing in credentials"});
    if(!currentTenant) reject({success:false, msg:"getBookmarksRoot: currentTenant is missing in credentials"});
    const URL = {
      base: _fedSearch,
      uri: "/search",
      opt: `?tenant=${currentTenant}`,
    };
  
    const formatedDatas = {
      select_predicate: [
        "ds6w:label",
        "physicalid",
        "mxid",
        "ds6w:type",
        "ds6w:identifier",
        "ds6w:classification",
        "icon_2ddefaultthb.subtype",
        "ds6w:reservedBy",
        "relcount",
        "taxonomies",
        "ParentBk",
        "owner",
        "ds6wg:revision",
        "ds6w:reserved",
        "ds6w:description",
        "ds6w:modified",
        "ds6w:created",
        "ds6w:responsible",
        "ds6w:status",
        "ds6w:policy",
        "ds6w:organizationResponsible",
        "ds6w:project",
      ],
      label: `Folder_read_getRoots_${new Date().getTime()}`,
      with_synthesis: "false",
      order_by: "asc",
      order_field: "ds6w:label",
      start: 0,
      nresults: 1000,
      select_file: ["icon", "thumbnail_2d"],
      query: 'flattenedtaxonomies:"types/Workspace"',
      locale: "fr",
      tenant: currentTenant,
      source: ["3dspace"],
      indexmode: "true",
      login: {
        "3dspace": {
          SecurityContext: `ctx::${ctx}`,
        },
      },
    };
  
    const url = `${URL.base}${URL.uri}${URL.opt}`;
  
    _httpCallAuthenticated(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-Type": "application/json",
        SecurityContext: `ctx::${ctx}`,
      },
      data: JSON.stringify(formatedDatas),
      type: "json",
      onComplete(response, headers, xhr) {
        const info = response;
  
        const bksRoots = info.results.map((bks) => {
          const obj = { id: bks.attributes[0].value };
          bks.attributes.forEach((attr) => {
            if (attr.name === "ds6w:label") obj["name"] = attr.value;
          });
          return obj;
        });
        resolve(bksRoots);
      },
      onFailure(error, headers, xhr) {
        const info = {};
        info["error"] = error;
        info["headers"] = headers;
        info["xhr"] = xhr;
        reject(info);
      },
    });
  });
}

export function _3DSpace_bookmark_getSubSignets(credentials, objIdBookmark) {
  return new Promise((resolve, reject) => {
    // const store = mainStore();

    const url = `${
      credentials.space
    }/resources/v1/FolderManagement/Folder/${objIdBookmark}/folderTree?tenant=${credentials.tenant.toUpperCase()}`;
    const body = {
      expandList: "",
      isRoot: "",
      isPersonalFolder: false,
      Read: true,
      nresults: 200,
      sortOrder: "asc",
      sortMode: "ds6w:label",
      nextStart: 0,
      refine: "",
    };
    _httpCallAuthenticated(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-Type": "application/json",
        SecurityContext: `ctx::${credentials.ctx}`,
      },
      data: JSON.stringify(body),
      type: "json",
      onComplete(response, headers, xhr) {
        // console.log("response: =>", response.folders);
        const info = response;
        console.log("getListBkEnfant | réponse => ", info);

        resolve(info);
      },
      onFailure(error, headers, xhr) {
        const info = {};
        info["error"] = error;
        info["headers"] = headers;
        info["xhr"] = xhr;
        if (onError) {
          onError(info);
          console.log("Coucou dans enfant");
          throw new Error("Coucou dans enfant", { cause: error });
        }
      },
    });
  });
}

// ANCHOR: _3dspace_bookmark_getChildren
// TODO : A finir , manque la FN _3dspace_get_multiDocInfo()
export function _3DSpace_bookmark_getItems(credentials, objIdBookmark) {
  return new Promise((resolve, reject) => {
    // const store = mainStore();

    const url = `${credentials.space}/resources/v1/modeler/dsbks/dsbks:Bookmark/${objIdBookmark}?$mask=dsbks:BksMask.Items`;
    _httpCallAuthenticated(url, {
      headers: {
        SecurityContext: `ctx::${credentials.ctx}`,
      },
      onComplete: (response) => {
        let tryParse;
        try {
          tryParse = JSON.parse(response);
        } catch (error) {
          tryParse = response;
        }
        resolve(tryParse);
      },
      onFailure(response) {
        reject(response);
      },
    });
  });
}
export function _3DSpace_bookmark_newWorkspace(
  credentials,
  parentId,
  title,
  description,
  onDone = undefined,
  onError = undefined
) {
  return new Promise((result) => {
    const url = `${credentials.space}/resources/v1/modeler/dsbks/dsbks:Bookmark`;
    let item = {
      attributes: {
        title,
        description,
        inheritedAccess: "no",
      },
    };
    let bodyRequest = {
      items: [],
    };
    if (parentId) bodyRequest["parentId"] = parentId;
    bodyRequest.items.push(item);

    let options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        SecurityContext: credentials.ctx,
        ENO_CSRF_TOKEN: credentials.token,
      },
      data: JSON.stringify(bodyRequest),
      type: "json",
      onComplete(response) {
        if (onDone) onDone(response);
      },
      onFailure(response) {
        if (onError) onError(response);
      },
    };
    _httpCallAuthenticated(url, options);
  });
}
/**
 * @description `_3DSpace_bookmark_addSubsciptions`
 * @param {Object} credentials
 * @param {String} objectId
 * @param {String} personList "<uuid:5ca25b8e-98d0-46c3-ac43-3faa83c4295a>"
 * @param {Array} eventsList "NXFolderCreated,NXFolderDeleted,NXContentAdded,NXContentRemoved"
 * @param {Function} onDone
 * @param {Function} onError
 * @returns {Promise}
 */
export function _3DSpace_bookmark_addSubsciptions(
  credentials,
  objectId,
  personList,
  eventsList,
  onDone = undefined,
  onError = undefined
) {
  console.log("credentials", credentials);
  return new Promise((result) => {
    const url = `${credentials.space}/resources/v1/modeler/subscriptions/createPushSubscription?xrequestedwith=xmlhttprequest`;

    let options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        csrf: {
          name: "ENO_CSRF_TOKEN",
          value: credentials.token,
        },
        data: [
          {
            type: "Workspace",
            cestamp: "businessobject",
            relId: objectId,
            id: objectId,
            dataelements: {
              personList,
              eventsList,
            },
            tenant: credentials.tenant,
          },
        ],
      }),
      type: "json",
      onComplete(response) {
        if (onDone) onDone(response);
      },
      onFailure(response) {
        if (onError) onError(response);
      },
    };
  });
}

//!SECTION

// module.exports = {

//   _3DSpace_bookmark_getChildren,
// };
