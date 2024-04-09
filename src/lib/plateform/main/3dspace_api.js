import {
  _httpCallAuthenticated,
  _getPlatformServices,
  _getPlateformInfos,
} from "./3dexperience_api";
import {
  UUID
} from "../../api/index";
import {
  getCSRFToken
} from "./getCSRFToken";
import {
  DateTime
} from "luxon";

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
  const url = _3DSpace + `/resources/v1/modeler/documents/ids?$fields=revision&$include=!files,!ownerInfo,!originatorInfo,versions`;
  _httpCallAuthenticated(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: `"$ids": "${docids.join(",")}"`,
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
        if (onDone) onDone(rep);
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

        onComplete(response) {
          let info = JSON.parse(response);

          const file_url = info.data[0].dataelements.ticketURL;

          if (onDone) onDone(file_url);
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
  csr,
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
  _3DSpace_get_csrf(
    credentials,
    docId,
    (info) => {
      _3DSpace_file_update_csr(
        credentials,
        docId,
        fileId,
        data,
        filename,
        info.csrf.value,
        onDone,
        onError
      );
    },
    onError
  );
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
    `/resources/v1/modeler/documents/${docId}/files/CheckinTicket`;
  _httpCallAuthenticated(url, {
    method: "PUT",
    headers: {
      ENO_CSRF_TOKEN: csr,
    },

    onComplete(response, headers, xhr) {
      const info = JSON.parse(response).data[0].dataelements;

      const formData = new FormData();

      formData.append("__fcs__jobTicket", info.ticket);
      formData.append("file_0", data, filename);

      const opts = {};
      opts.method = "POST";
      opts.data = formData;

      opts.onComplete = function (response) {
        //Update the FCS file receipt
        let tempId = "temp_" + Date.now();
        let options = {
          method: "PUT",
          headers: {
            ENO_CSRF_TOKEN: csr,
          },
          data: JSON.stringify({
            data: [{
              id: docId,
              relateddata: {
                files: [{
                  id: fileId,
                  dataelements: {
                    title: filename,
                    receipt: response,
                  },
                  updateAction: "REVISE",
                }, ],
              },
              tempId,
            }, ],
          }),

          type: "json",

          onComplete(response) {
            if (onDone) onDone(response);
          },

          onFailure(response) {
            if (onError) onError(response);
          },
        };

        _httpCallAuthenticated(
          credentials.space + "/resources/v1/modeler/documents",
          options
        );
      };

      opts.onFailure = function (err) {
        if (onError) onError(err);
      };

      opts.timeout = 0;

      _httpCallAuthenticated(info.ticketURL, opts);
    },
  });
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
  desc, // ref name
  onDone = undefined,
  onError = undefined
) {
  const _space = credentials.space;
  const csr = credentials.token;
  const ctx = credentials.ctx;

  const formData = new FormData();
  const jsonFile = new Blob([JSON.stringify(data)], {
    type: "text/plain",
  });

  const urls = {
    url_Ticket: `${_space}/resources/v1/modeler/documents/files/CheckinTicket`,
    url_Post: `${_space}/resources/v1/modeler/documents/?SecurityContext=ctx::${ctx}`,
  };

  if (!_space && _space !== "") {
    console.log("le store._3DSpace est vide");
    return;
  }
  // 1
  _httpCallAuthenticated(urls.url_Ticket, {
    method: "PUT",
    headers: {
      ENO_CSRF_TOKEN: csr.value,
    },

    onComplete(response, headers, xhr) {
      const info = JSON.parse(response).data[0].dataelements;

      formData.append("__fcs__jobTicket", info.ticket);
      formData.append("filename", jsonFile, filename);

      const opts = {
        method: "POST",
        data: formData,

        onComplete(ticket) {
          if (ctx !== "" && csr !== "") {
            const options = {
              method: "POST",
              headers: {
                ENO_CSRF_TOKEN: csr,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                data: [{
                  type: "Document",
                  dataelements: {
                    title: `Title_${filename
                        .toLowerCase()
                        .split(" ")
                        .join("_")}`,
                    policy: "Document Release",
                    description: desc,
                  },
                  relateddata: {
                    files: [{
                      dataelements: {
                        title: `${filename}.json`,
                        receipt: ticket,
                      },
                    }, ],
                  },
                  tempId: UUID(),
                }, ],
              }),
              type: "json",
              timeout: 0,

              onComplete: handleSuccess,
              onFailure: handleError,
            };

            if (ctx !== "") {
              // 3
              _httpCallAuthenticated(urls.url_Post, options);
            }
          } else {
            console.warn("le store est vide");
          }
        },

        onFailure: handleError,
      };

      function handleSuccess(response) {
        console.log("Success -- response ", response.data[0]);

        if (onDone) {
          onDone(response);
        }
      }

      function handleError(response, headers) {
        console.log("Erreur -- response ", response, "\n headers ", headers);
        if (onError) {
          onError(response);
        }
      }

      _httpCallAuthenticated(info.ticketURL, opts);
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
      console.log("Erreur de récupération du contexte de sécurité. => ", {
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
  }

  if (credentials.space === "" || !credentials.space) {
    console.warn(
      "_3DSpace_download_doc() / Le paramètre space est obligatoire"
    );
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
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };
        _httpCallAuthenticated(ticketURL, {
          headers,
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
 * @description La fonction `_3dspace_download_multidoc` télécharge plusieurs documents à partir d'un espace 3D en
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
  let listDiv = [];
  const chunkSize = 80;
  if (
    typeof objectIds !== "undefined" &&
    Array.isArray(objectIds) &&
    objectIds?.length > 0
  ) {
    for (let i = 0; i < objectIds.length; i += chunkSize) {
      const chunk = objectIds.slice(i, i + chunkSize);
      listDiv.push(chunk);
    }
    const loop = (i) => {
      _3DSpace_get_downloadTicket_multidoc(
        credentials,
        listDiv[i],
        () => {
          i++;
          if (i < listDiv.length) {
            loop(i);
          }
        },
        (done) => {
          if (onDone) onDone(done);
        }
      );
    };

    loop(0);
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
              onComplete: (response) => {
                if (onDone)
                  onDone({
                    objectId: data.id,
                    fileName,
                    data: JSON.parse(response),
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
          data: [{
            id: objectId,
          }, ],
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
          data: [{
            id: objectId,
            nextState,
          }, ],
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
          graphRequests: [{
            id: objectId,
          }, ],
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
          data: [{
            "attribute[PLMReference.V_versionComment]": null,
            physicalid: objectId,
            type: "Document",
            tenant: credentials.tenant,
            objectId,
            policy: "Document Release",
            availableSemantic: ["E", "LAST", "NEW", "DUP"],
          }, ],
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
          data: [{
            physicalid: objectId,
            proposedRevision: nextRevision,
            modifiedAttributes: {
              revision: nextRevision,
            },
          }, ],
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
// SECTION: BOOKMARKS
// ANCHOR: _3dspace_bookmark_getChildren
// TODO : A finir , manque la FN _3dspace_get_multiDocInfo()
// function _3DSpace_bookmark_getChildren(
//   credentials,
//   objIdBookmark,
//   onDone = undefined,
//   onError = undefined,
// ) {
//   return new Promise((resolve, reject) => {
//     // const store = mainStore();

//     const url = `${credentials.space}/resources/v1/modeler/dsbks/dsbks:Bookmark/${objIdBookmark}?$mask=dsbks:BksMask.Items`;
//     _httpCallAuthenticated(url, {
//       headers: {
//         SecurityContext: `ctx::${credentials.ctx}`,
//       },
//       onComplete: (response) => {
//         let tryParse;
//         try {
//           tryParse = JSON.parse(response);
//         } catch (error) {
//           tryParse = response;
//         }
//         if (typeof tryParse === "object") {
//           let items = tryParse?.member[0]?.items?.member;
//           if (items) {
//             const listObjIds = items.map((e) => {
//               if (e?.referencedObject?.identifier) {
//                 return e.referencedObject.identifier;
//               }
//             });
//             if (listObjIds.length) {
//               _3DSpace_get_multiDocInfo(host, listObjIds, (res) => {
//                 console.log("_3dspace_get_multiDocInfo Response : ", {
//                   ...res,
//                 });
//                 if (res?.data.length) {
//                   const listResponses = res.data;
//                   listResponses.forEach((r) => {
//                     let currentObject = items.find(
//                       (o) => o.referencedObject.identifier === r.identifier,
//                     );
//                     if (currentObject) {
//                       currentObject.referencedObject["dataelements"] =
//                         r.dataelements;
//                     }
//                   });
//                 }
//               });
//             }
//           }
//         }

//         if (onDone) onDone(tryParse);
//         resolve = tryParse;
//         return resolve;
//       },
//       onFailure(response) {
//         if (onError) onError(response);
//         reject = response;
//         return reject;
//       },
//     });
//   });
// }
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
        data: [{
          type: "Workspace",
          cestamp: "businessobject",
          relId: objectId,
          id: objectId,
          dataelements: {
            personList,
            eventsList,
          },
          tenant: credentials.tenant,
        }, ],
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