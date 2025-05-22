import { _httpCallAuthenticated } from "../main/3dexperience_api";

//LINK - https://media.3ds.com/support/documentation/developer/Cloud/en/English/CAAi3DXUGREST/UsersGroup_v1.htm#
//!SECTION, Pour faire des modification de UG il faut être OWNER

// URI de test sur le tenant PIVETEAU_TEST:
const _uri = "uuid:3fcb61f2-6417-476d-8a9c-a16fb888771e";

const topHeader = {
  "Content-Type": "application/json",
  Accept: "application/json,text/javascript,*/*",
};

/**
 * @description La fonction `createUserGroups` crée un nouveau groupe d'utilisateurs avec les détails et les membres
 * spécifiés. Attention, l'indexation du UserGroup met du temps.

 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {Object} credentials.currentUser.email - Le paramètre `currentUser` est un qui contient les informations de l'utilisateur qui envoie le message(appeler depuis la fonction `_3DSwym_get_currentuser`).
 * 
 * @param {Object} datas - Les informations du groupe d'utilisateurs.
 * @param {String} datas.title - Le titre du groupe d'utilisateurs. Entre 3 et 128 caractères, obligatoire.
 * @param {String} datas.description - La description du groupe d'utilisateurs. 512 caractères max.
 * @param {Array} datas.members - Un tableau d'emails des membres du groupe d'utilisateurs. 100 max email par groupe.
 * @param {String} datas.sharing - Le droit de partage du groupe d'utilisateurs. owner/manager/viewer
 * @param {String} datas.visibility - La visibilité du groupe d'utilisateurs. public/private
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque l'appel d'API réussit et que les
 * groupes d'utilisateurs sont créés. Il recevra les données de réponse comme argument.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `createUserGroups`. Il vous permet de gérer et de traiter
 * l'erreur de manière personnalisée.
 */
export function createUserGroups(
  credentials,
  datas,
  onDone = undefined,
  onError = undefined,
) {
  const { space, currentUser } = credentials;
  const URL = {
    URIUGr: "/3drdfpersist/resources/v1/usersgroup",
  };
  const url = `${space}${URL.URIUGr}`;

  const templateData = {
    groups: [
      {
        title: datas.title,
        description: datas.description,
        members: datas.members || [currentUser.email, "samuel.mureau@beam3.fr"],
        pending_members: [],
        sharing: datas.sharing,
        visibility: datas.visibility,
      },
    ],
  };

  _httpCallAuthenticated(url, {
    method: "POST",
    headers: topHeader,
    data: JSON.stringify(templateData),
    onComplete(response) {
      if (onDone) onDone(JSON.parse(response));
    },
    onFailure(err, headers) {
      console.log(err);
      const info = err;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;
      console.log("❌ sendDirectMessage => ", info);
      if (onError) onError(info);
    },
  });
}

/**
 * @description La fonction `getComplementUG` effectue une requête GET vers un URI spécifié avec les informations
 * d'authentification et renvoie la réponse.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex: R1132100968447)
 * @param {String} [uri] - Le paramètre `uri` est l'identifiant de la ressource dont vous souhaitez récupérer le
 * complément. (ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête HTTP sera terminée avec succès. Il prend un argument, qui correspond aux données de réponse
 * de la requête.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `getComplementUG`. Il vous permet de gérer et de traiter
 * les informations d'erreur.
 */
export function getComplementUG(
  credentials,
  uri,
  onDone = undefined,
  onError = undefined,
) {
  const { space, tenant } = credentials;
  const baseURL = space;
  const URI = `/3drdfpersist/v1/resources/${uri}`;
  const OPTs = `?$mask=dsaccess:Mask.GroupUI.Properties&tenant=dstenant:${tenant}`;
  const URL = `${baseURL}${URI}${OPTs}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json,text/javascript,*/*",
  };
  const opts = {
    method: "GET",
    headers: headers,
  };

  _httpCallAuthenticated(URL, {
    opts,
    onComplete(response) {
      if (onDone) onDone(JSON.parse(response));
    },
    onFailure(err, headers) {
      const info = err;
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;

      if (onError) onError(info);
    },
  });
}

/**
 * @description La fonction `getUsersGroupRules` effectue une requête HTTP GET pour récupérer une liste de
 * responsabilités de groupe pour un groupe d'utilisateurs.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex: R1132100968447)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête HTTP sera terminée avec succès. Il faut un argument, qui correspond aux données de réponse
 * analysées au format JSON.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `getUsersGroupRules`. C'est un paramètre facultatif, donc
 * s'il n'est pas fourni, la fonction ne fera rien en cas d'erreur.
 */
export function getUsersGroupRules(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  const { _usersgroup, tenant } = credentials;
  const baseURL = _usersgroup;
  const URI =
    "/3drdfpersist/resources/v1/option-sets/dsusergroup:ListOfGroupResponsibilities/options";
  const OPTS = `?tenant=dstenant:${tenant}`;
  const OPTsH = {
    method: "GET",
    Accept: "application/json,*/*,test/javascript",
  };
  const URL = `${baseURL}${URI}${OPTS}`;

  _httpCallAuthenticated(URL, {
    OPTsH,
    onComplete(response) {
      if (onDone) onDone(JSON.parse(response));
    },
    onFailure(err, headers) {
      const info = err;
      info["function"] = "getUsersGroupRules()";
      info["msg"] = headers.errormsg;
      info["errCode"] = headers.errorcode;

      if (onError) onError(info);
    },
  });
}

/**
 * @description La fonction « getUserGroupsList » récupère une liste de groupes d'utilisateurs d'un serveur en
 * utilisant les informations d'identification fournies et appelle la fonction de rappel « onDone »
 * avec la réponse.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex: R1132100968447)
 * @param {String} credentials._usersgroup - l'url de la plateforme concernant les usergroups (comme le credentials.space).
 * @param {Number} credentials.numMax - nombre maximum de groupes d'utilisateurs par page, par défaut 50.
 * @param {Object} credentials.currentUser.email - Le paramètre `currentUser` est un objet qui contient les informations de l'utilisateur qui envoie le message(appeler depuis la fonction `_3DSwym_get_currentuser`)
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque l'opération sera terminée avec
 * succès. Il recevra la réponse en paramètre.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `getUserGroupsList`. Il vous permet de gérer et de
 * répondre à toute erreur qui se produit.
 */
export function getUserGroupsList(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  const { _usersgroup, currentUser, numMax } = credentials;

  if (!numMax) numMax = 50;
  const URI = "/3drdfpersist/resources/v1/usersgroup";
  const opt = "?select=uri,title,owner,members";
  const opt2 = `&top=${numMax}`; // max à 100
  const url = `${_usersgroup}${URI}${opt}${opt2}`;
  const header = {
    "Content-Type": "application/json",
    Accept: "application/json,text/javascript,*/*",
  };
  const opts = { method: "GET", headers: header };
  try {
    _httpCallAuthenticated(url, {
      opts,
      onComplete(response) {
        const repUG = JSON.parse(response);
        const reponse = {};
        const UG = repUG.groups.filter((element) => {
          return element.uri.startsWith("uuid:");
        });

        if (currentUser && Object.keys(currentUser).length > 0) {
          const iamOwner = UG.filter((element) => {
            return element.owner === currentUser.email;
          });
          const iamMember = UG.filter((element) => {
            return element.members.includes(currentUser.email);
          });
          const iam = iamOwner.concat(iamMember);
          reponse["iam"] = iam;
          reponse["UG"] = UG;
          reponse["iamMember"] = iamMember;

          getUsersGroupRules(
            credentials,
            (rules) => {
              reponse["rules"] = rules;
              if (onDone) onDone(reponse);
            },
            (err) => {
              err.function += ", getUserGroupsList()";

              if (onError) onError(err);
            },
          );
        }
      },
      onFailure(err, headers) {
        const info = err;
        info["function"] = "getUserGroupsList()";
        info["msg"] = headers.errormsg;
        info["errCode"] = headers.errorcode;

        if (onError) onError(info);
      },
    });
  } catch (error) {
    console.log(error);
    const infoError = {
      infoError: error,
      fonction: "getUserGroupsList()",
      catch: new Error("Erreur sur la fonction getUserGroupsList()", {
        cause: error,
      }),
    };
    onError(infoError);
  }
}

/**
 * @description La fonction `getUserGroupsByURIList` est utilisée pour récupérer
 * la liste des groupes d'utilisateurs en fonction d'une liste d'uri fournie.
 * @param {Object} credentials - Un objet contenant les informations d'identification
 * requises pour authentifier la demande. Il inclut généralement des propriétés
 * telles que `token`, `space`, `tenant` et `ctx`.
 * @param {String} credentials.base_url - L'URL du serveur sur lequel l'API est déployée.
 * @param {String} credentials.lists_uri - Un tableau de string qui représente les uri des groupes
 * d'utilisateurs que vous souhaitez récupérer.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque la
 * requête HTTP sera terminée avec succès. Elle reçoit la réponse en paramètre.
 * @param {Function} [onError] - Une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `getUserGroupsByURIList`. Elle reçoit
 * un objet en paramètre qui contient des informations sur l'erreur.
 */
export function getUserGroupsByURIList(credentials, onDone, onError) {
  const { base_url, lists_uri, currentUser } = credentials;

  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": "fr",
  };

  const URLElements = {
    baseUrl: base_url,
    uri: "/3drdfpersist/resources/v1/usersgroup/groups",
  };

  const url = URLElements.baseUrl + URLElements.uri;

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ groups: lists_uri }),
  };
  /*
ex :
groups:[
{uri:'uuid:351d1s61s616ds1vdsvgsv'}, {uri:'uuid:351d1s61s616ds1vdsvgsv'}
]
*/

  try {
    _httpCallAuthenticated(url, {
      options,
      onComplete(response) {
        if (onDone) {
          onDone(response);
        }
      },
      onFailure(err, headers) {
        const infoError = {
          infoError: err,
          msg: headers,
          fonction: "getUserGroupsByURIList()",
          catch: new Error("Erreur sur la fonction getUserGroupsByURIList()", {
            cause: err,
          }),
        };
        onError(infoError);
      },
    });
  } catch (error) {
    console.log(error);
    const infoError = {
      sendOptions: options,
      infoError: error,
      fonction: "getUserGroupsByURIList()",
      catch: new Error("Erreur sur la fonction getUserGroupsByURIList()", {
        cause: error,
      }),
    };
    onError(infoError);
  }
}

/**
 * @description La fonction deleteUserGroups est utilisée pour supprimer des groupes d'utilisateurs à l'aide des
 * informations d'identification et de l'URI fournis.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} [uri] - Le paramètre `uri` est l'identifiant du groupe d'utilisateurs que vous souhaitez
 * supprimer. Il est utilisé pour construire l'URL de la requête DELETE.(ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 */

export function deleteUserGroups(credentials, uri) {
  const { space } = credentials;
  const URI = "/3drdfpersist/resources/v1/usersgroup";
  const url = `${space}${URI}/${uri}`;

  const opts = {
    method: "DELETE",
  };
  _httpCallAuthenticated(url, opts);
}

/**
 * @description La fonction `patchUserGroups` est utilisée pour mettre à jour les groupes d'utilisateurs en envoyant
 * une requête PATCH à un URI spécifié avec les données fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} credentials.tenant - L'identifiant du tenant sur lequel l'API est déployée.(ex: R1132100968447)
 * @param uri - Le paramètre `uri` est une chaîne qui représente l'identifiant du groupe d'utilisateurs
 * que vous souhaitez corriger. Il est utilisé pour construire l'URL de la requête PATCH.(ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 * @param {ArrayOfObjects} datas - Le paramètre `datas` est un tableau d'objets qui spécifient les modifications à
 * apporter aux groupes d'utilisateurs.(ex: datas[0].op, datas[0].field, datas[0].value)
 * @param {String} datas[0].op - l'opération à réaliser. (ex: "add", "remove", "replace")
 * @param {String} datas[0].field - Ce sur quoi agir (ex: members[], title, description, owner, visibility)
 * @param {StringOrArray} datas[0].value - La nouvelle valeur impactée. Si ce sont des membres value sera un Tableau de String.
 
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque la requête PATCH sera terminée
 * avec succès. Il recevra la réponse en paramètre.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `patchUserGroups`. Il vous permet de gérer toutes les
 * erreurs qui se produisent et d’effectuer toute gestion ou journalisation des erreurs nécessaire.
 */
export function patchUserGroups(
  credentials,
  uri,
  datas,
  onDone = undefined,
  onError = undefined,
) {
  const { space, tenant } = credentials;
  const URL = {
    URITI: "/3drdfpersist/resources/v1/template-instances",
    URIUGr: "/3drdfpersist/resources/v1/usersgroup",
    nextURICh: "/characteristics",
    nextURIGr: "/group",
    nexURImem: "/members",
    OPTsTI: `?$mask=dsaccess:Mask.GroupUI.Properties`,
    OPTsTenant: `tenant=dstenant:${tenant}`,
  };

  // Le format des datas est obligatoire : [{}]
  // op : add, replace, remove
  // field : members[], pending_members[], title, description, owner, visibility
  // value : string ou array

  const dataMembers = datas;
  //  [
  //   {
  //     op: "add",
  //     field: "members",
  //     value: ["samuel.mureau@beam3.fr"],
  //   },
  //   {
  //     op: "replace",
  //     field: "title",
  //     value: "BEAM³ R&D - DEV",
  //   },
  // ];

  const baseURL = `${space}${URL.URIUGr}/${uri}`; // route de base pour le PATCH (DOC)

  const dataMembersSTR = JSON.stringify(dataMembers);

  _httpCallAuthenticated(baseURL, {
    headers: topHeader,
    method: "PATCH",
    data: dataMembersSTR,
    type: "json",
    onComplete(response) {
      if (onDone) onDone(response);
    },
    onFailure(err) {
      if (onError) onError(err);
    },
  });
}

//ANCHOR -  CONTROL (Gestion des propriétaires du groupe)

/**
 * @description La fonction `patchUserGroupsControl` est utilisée pour mettre à jour le contrôle des groupes
 * d'utilisateurs en envoyant une requête PATCH à un URI spécifié avec les informations
 * d'identification et les données fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} uri - Le paramètre `uri` est une chaîne qui représente l'identifiant du groupe d'utilisateurs
 * que vous souhaitez corriger. Il est utilisé pour construire l'URL de la requête PATCH.(ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 * @param {ArrayOfObject} _datas - Le paramètre `datas` est un tableau d'objets qui contient les informations
 * nécessaires pour patcher le contrôle des groupes d'utilisateurs. (ex : datas[0].op,  datas[0].value)
 * @param {String}   op - L'opération de correctif. Il peut être 'add', 'replace', 'remove'.
 * @param {Object}   value -
 * @param {Array}   value.agents - Un tableau d’utilisateurs. Le 1er index doit être à vide. (ex : ["","Bob.Dylan@beam3.fr"]). 100 utilisateurs maximums.
 * @param {Array} value.responsibilities - Un tableau de responsibilités. (ex: ["dsaccess:Responsibility.Group.MainOwner", "dsaccess:Responsibility.Group.Owner", "dsaccess:Responsibility.Group.Viewer", "dsaccess:Responsibility.Group.Author", "dsaccess:Responsibility.GroupService.Administrator"])
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque
 * l'opération de patch sera terminée avec succès. Il faut un argument, qui est la réponse du serveur.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `patchUserGroupsControl`. Il vous permet de gérer toutes
 * les erreurs qui se produisent et d’effectuer toute gestion ou journalisation des erreurs nécessaire.
 */
export function patchUserGroupsControl(
  credentials,
  uri,
  _datas,
  onDone = undefined,
  onError = undefined,
) {
  const { space } = credentials;
  const URI = "/3drdfpersist/resources/v1/usersgroup";

  const url = `${space}${URI}/${uri}/sharing`;
  //liste des responsabilités : ["dsaccess:Responsibility.Group.MainOwner", "dsaccess:Responsibility.Group.Owner", "dsaccess:Responsibility.Group.Viewer", "dsaccess:Responsibility.Group.Author", "dsaccess:Responsibility.GroupService.Administrator"]
  const datas = _datas;
  // [
  //   {
  //     op: "add", // add, replace, remove
  //     path: "/sharing",
  //     value: {
  //       agents: ["", "samuel.mureau@beam3.fr", "yan.coquoz@beam3.fr"],
  //       responsibilities: ["dsaccess:Responsibility.Group.Owner"],
  //     },
  //   },
  // ];

  _httpCallAuthenticated(url, {
    method: "PATCH",
    headers: topHeader,
    data: JSON.stringify(datas),
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
 * @description La fonction « readUserGroupControl » est utilisée pour récupérer les informations de contrôle de
 * groupe d'utilisateurs à partir d'un URI spécifié à l'aide d'une requête HTTP GET.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, usersgroup, 3DCompass...)
 * @param {String} uri - Le paramètre `uri` est une chaîne qui représente l'identifiant du groupe d'utilisateurs
 * pour lequel vous souhaitez récupérer les informations de contrôle. (ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête HTTP sera terminée avec succès. Il prend un argument, qui correspond aux données de réponse
 * de la requête.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `readUserGroupControl`. Il vous permet de gérer et de
 * répondre à toute erreur qui se produit.
 */
export function readUserGroupControl(
  credentials,
  uri,
  onDone = undefined,
  onError = undefined,
) {
  const { space } = credentials;
  const URI = "/3drdfpersist/resources/v1/usersgroup";

  const url = `${space}${URI}/${uri}/sharing`;

  const header = {
    "Content-Type": "application/json",
    Accept: "application/json,text/javascript,*/*",
  };
  const opts = {
    method: "GET",
    headers: header,
  };
  _httpCallAuthenticated(url, {
    opts,
    onComplete(_rep) {
      if (onDone) onDone(JSON.parse(_rep));
    },
    onFailure(err) {
      if (onError) onError(err);
    },
  });
}
