import { _httpCallAuthenticated } from "../../main/3dexperience_api";
import { _3DSwym_get_Token } from "../3dswym_api";

/**
 * @description La fonction `_3dSwym_getAllCommunities` récupère une liste de communautés à partir d'une plateforme
 * 3D Swym en utilisant les informations d'identification fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Number} credentials.limit - Le paramètre `limit` est un nombre entier qui indique le nombre maximum de communautés à recevoir. Par défaut, il est de 10, mais vous pouvez le changer jusqu'à 128, au delà on change de page.
 * @param {Number} credentials.page - Le paramètre `page` est un nombre entier qui indique la page courante. Par défaut, il est à 1.
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée une fois l'opération terminée. Il prend la
 * liste des communautés comme paramètre.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3dSwym_getAllCommunities`. Il vous permet de gérer et de
 * répondre à toute erreur qui se produit.
 */
export function _3DSwym_getAllCommunities(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  const URL = {
    base: credentials._3DSwym,
    uri: "/api/community/listmycommunities",
    limit: `/limit/${credentials.limit ? credentials.limit : 500}`,
    page: `/page/${credentials.page ? credentials.page : "1"}`,
  };

  const url = `${URL.base}${URL.uri}${URL.limit}${URL.page}`;
  const communautes = [];
  _3DSwym_get_Token(credentials, (token) => {
    _httpCallAuthenticated(url, {
      method: "GET",
      headers: {
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      onComplete(response, headers, xhr) {
        const info = JSON.parse(response);
        const _communitiesInfo = info.result;
        let count = 0;

        _communitiesInfo.forEach((commu) => {
          const _communaute = {
            description: commu.description,
            id: commu.id,
            title: commu.title,
            owner: commu.owner,
            role: commu.role,
            access: commu.access,
          };
          _3DSwym_getMembersCommunity(
            credentials,
            commu.id,
            (data) => {
              count++;
              _communaute["members"] = data;
              communautes.push(_communaute);
              if (count === _communitiesInfo.length && onDone) {
                onDone(communautes);
              }
            },
            (err) => onError(err)
          );
        });
      },
      onFailure(response, headers) {
        const info = response;
        info["status"] = headers.status;
        info["response"] = headers.errormsg;
        if (onError) onError(info);
      },
    });
  });
}

/**
 * @description La fonction `_3DSwym_getMembersCommunity` récupère une liste des membres d'une communauté en utilisant les informations d'identification et l'ID de communauté fournis.
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Number} credentials.limit - Le paramètre `limit` est un nombre entier qui indique le nombre maximum de communautés à recevoir. Par défaut, il est de 50, mais vous pouvez le changer jusqu'à 128, au delà on change de page.
 * @param {Number} credentials.page - Le paramètre `page` est un nombre entier qui indique la page courante. Par défaut, il est à 1.
 * @param {String} idCommu - L'identifiant de la communauté dont vous souhaitez récupérer les membres. (ex: "YXdA5x4DSUKtlAi2wmnyTA")
 * @param {Function} onDone - Une fonction de rappel qui sera appelée lorsque l'appel d'API réussit et renvoie les
 * données de réponse. Les données de réponse seront transmises en argument à cette fonction.
 * @param {Function} onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_getMembersCommunity`. Il est utilisé pour gérer
 * toutes les erreurs qui se produisent et fournir une gestion des erreurs ou des messages d'erreur
 * appropriés à l'appelant de la fonction.
 */
export function _3DSwym_getMembersCommunity(
  credentials,
  idCommu,
  onDone,
  onError
) {
  const URL = `${credentials._3DSwym}/api/community/listmembers`;

  const datas = {
    params: {
      page: credentials.page ? credentials.page : 1,
      limit: credentials.limit ? credentials.limit : 50,
      community_id: idCommu,
    },
  };
  _3DSwym_get_Token(credentials, (token) => {
    _httpCallAuthenticated(URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      data: JSON.stringify(datas),
      type: "json",
      onComplete(response, headers, xhr) {
        const info = response;
        if (onDone) onDone(info);
      },
      onFailure(response, headers) {
        const info = response;
        info["status"] = headers.status;
        info["response"] = headers.errormsg;
        if (onError) onError(info);
      },
    });
  });
}

/**
 * @description La fonction `_3DSwym_getIdeaStatusMaturity` récupère le statut et la maturité d'une idée d'une
 * communauté 3DExperience à l'aide des informations d'identification fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials._3DSwym - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {String} credentials.commu_id - L'ID de communauté 3DExperience (ex:"YXdA5x4DSUKtlAi2wmnyTA")
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête API sera terminée avec succès. Il prend un argument, « info », qui correspond aux données de
 * réponse de l'API.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_getIdeaStatusMaturity`. Il vous permet de gérer
 * et de traiter l'erreur de manière personnalisée.
 */
export function _3DSwym_getIdeaStatusMaturity(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  const commuID = "YXdA5x4DSUKtlAi2wmnyTA";
  if (!credentials.commu_id) credentials.commu_id = commuID;
  const URL = `${credentials._3DSwym}/api/v2/communities/${credentials.commu_id}/ideas/statuses`;
  _3DSwym_get_Token(credentials, (token) => {
    _httpCallAuthenticated(URL, {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },

      onComplete(response) {
        const info = JSON.parse(response);

        if (onDone) onDone(info);
      },
      onFailure(response, headers) {
        const info = response;
        info["status"] = headers.status;
        info["response"] = headers.errormsg;
        if (onError) onError(info);
      },
    });
  });
}

// TEST
const contentMSG = {
  receipt: ["c00005701637"], // Liste des personnes à qui envoyer le message
  msg: "TESTS Beam ³ DEV, Happy new year ! ヾ(⌐■_■)ノ♪", // Message à envoyer
};

// CREATION DE MESSAGES DIRECT OU INSTANTANÉ

/**
 * @description La fonction `_3DSwym_buildDirectMessage` permet d'envoyer un message direct à un ou plusieurs utilisateurs dans un espace plateforme 3DExperience.
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials._3DSwym - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Object} [credentials.currentUser] - Le paramètre `currentUser` est un qui contient les informations de l'utilisateur qui envoie le message(appeler depuis la fonction `_3DSwym_get_currentuser`).
 * @param {string} [credentials.currentUser.login] - Le paramètre `login` est l'identifiant d'envois du message
 * @param {string} [credentials.currentUser.first_name] - Le paramètre `first_name` est l'identifiant d'envois du message
 * @param {string} [credentials.currentUser.last_name] - Le paramètre `last_name` est l'identifiant d'envois du message.
 *
 * @param {Object} [datas] - Le paramètre `datas` est un objet qui contient les données du messages.
 * @param {String} [datas.msg] - Le paramètre `msg` est une chaîne de caractères qui contient le message à envoyer.
 *
 * @param {Array} [datas.receipt] - La liste des utilisateurs à qui envoyer le message (login). La liste des personnes accessible est générer par la fonction _3DSwym_getFamiliarPeople. (ex: ["bem3_yan.coquoz","bem_bob_Dylan"])
 *
 * @param {Function} [onDone] - Une fonction de rappel qui sera appelée lorsque le message direct sera envoyé avec
 * succès. Il prend un argument, qui est un objet contenant des informations sur la réponse du serveur.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_buildDirectMessage`. Il est facultatif et peut
 * être indéfini.
 */
export function _3DSwym_buildDirectMessage(
  credentials,
  datas,
  onDone = undefined,
  onError = undefined
) {
  const { listAllContacts, currentUser, _3DSwym } = credentials;
  console.log("__listAllContacts", listAllContacts.hits);
  const _URL = `${_3DSwym}/api/directmessages`;

  const _data = {
    users: [currentUser.login].concat(datas.receipt),
  };

  const MSGData = {
    id_msg: "",
    senderId: credentials.currentUser.login,
    senderName: `${credentials.currentUser.first_name} ${credentials.currentUser.last_name}`,
    msg: formatedMessage(datas.msg),
  };
  let otherCommunity = false;
  _3DSwym_findCommunityToInstantMSG(
    _data.users,
    (rep) => {
      if (rep !== undefined) {
        MSGData["id_msg"] = rep.id;
        otherCommunity = true;
        _3DSwym_sendMessageData(credentials, MSGData);
      }
    },
    (err) => {
      otherCommunity = false;
      console.log("_3dSwym_findCommunityToInstantMSG callback", err);
      if (onError) onError(err);
      MSGData["id_msg"] = "";
    }
  );

  if (otherCommunity === false) {
    setTimeout(() => {
      if (otherCommunity === false) {
        _3DSwym_get_Token(credentials, (token) => {
          _httpCallAuthenticated(_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
            },
            data: JSON.stringify(_data),
            type: "json",
            onComplete(response, headers, xhr) {
              const info = response;
              info["reponse"] = JSON.parse(xhr.response);
              info["status"] = xhr.status;
              if (onDone) onDone(info);
              MSGData["id_msg"] = info.result.id;
              _3DSwym_sendMessageData(credentials, MSGData);
            },
            onFailure(response, headers, xhr) {
              const info = response;
              info["msg"] = headers.errormsg;
              info["status"] = headers.status;

              if (onError) onError(info);
            },
          });
        });
      }
    }, 500);
  }
}

/**
 * @description La fonction `_3DSwym_findCommunityToInstantMSG` est utilisée pour rechercher une communauté dans une
 * plateforme 3DExperience pour la messagerie instantanée en fonction des informations d'identification
 * et des données fournies.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param {Array} datas - Le paramètre `datas` est un tableau qui contient les données à utiliser pour trouver une communauté pour envoyer un message instantané.
 * @param {Function} onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque
 * l'opération sera terminée avec succès. Il faut un argument, qui est le résultat de l'opération.
 * @param {Function} onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_findCommunityToInstantMSG`. Il est facultatif et
 * peut être omis s’il n’est pas nécessaire.
 */
export function _3DSwym_findCommunityToInstantMSG(
  credentials,
  datas,
  onDone,
  onError
) {
  const URL = `${credentials._3DSwym}/api/directmessages/lite?with_favorites=false`;
  _3DSwym_get_Token(credentials, (token) => {
    _httpCallAuthenticated(URL, {
      method: "GET",
      headers: {
        Accept: "application/json,text/javascript,*/*",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      onComplete(response) {
        const info = JSON.parse(response);
        const infoSortedByLengths = [];
        info.result.forEach((com) => {
          com.users = com.users.sort((a, b) => {
            return a.login.localeCompare(b.login);
          });
          if (com.users.length === datas.length) {
            infoSortedByLengths.push(com);
          }
        });
        const sortedDatas = datas.sort();

        const _datas = infoSortedByLengths.find((com) => {
          const logins = [];
          com.users.forEach((user) => {
            logins.push(user.login);
          });
          return JSON.stringify(logins) === JSON.stringify(sortedDatas);
        });

        if (onDone && _datas !== undefined) {
          onDone(_datas);
        } else if (onError || _datas === undefined) {
          onError(_datas);
        }
      },
      onFailure(response) {
        const info = response;
        info["msg"] = headers.errormsg;
        info["errCode"] = headers.errorcode;
        console.log("❌ sendDirectMessageLite => ", info);
        if (onError) onError(info);
      },
    });
  });
}

/**
 * @description La fonction `_3DSwym_sendMessageData` envoie un message direct avec les informations
 * d'identification et le contenu donnés, et appelle les rappels `onDone` ou `onError` en fonction du
 * succès ou de l'échec de la requête.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace =>(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia), 3DSwym, 3DCompass...)
 * @param content - Le paramètre `content` est un objet qui contient les propriétés suivantes :
 * @param {String} content.id_msg - L'identifiant du message à envoyer.
 * @param {String} content.senderId - L'identifiant de l'utilisateur qui envoie le message.
 * @param {String} content.senderName - Le nom de l'utilisateur qui envoie le message.
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'envoi
 * du message sera terminé avec succès. Il prend un argument, qui est un objet contenant des
 * informations sur la réponse du serveur.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_sendMessageData`. Il vous permet de gérer et de
 * traiter les informations d'erreur.
 */
export function _3DSwym_sendMessageData(
  credentials,
  content,
  onDone = undefined,
  onError = undefined
) {
  const URL = {
    base: credentials._3DSwym,
    uri: "/api/community",
    id_msg: `${content.id_msg}`,
    endUri: "/instantmessages",
  };

  const url = `${URL.base}${URL.uri}/${URL.id_msg}${URL.endUri}`;

  const datas = {
    author: { login: content.senderId, displayName: content.senderName },
    accessState: null,
    commentUri: null,
    comments: null,
    endorsements: null,
    moderationState: null,
    parentCommentUri: null,
    richMessage: content.msg,
  };
  console.log("_3dSwym_sendDirectMessageData url ", url);
  _3DSwym_get_Token(credentials, (token) => {
    _httpCallAuthenticated(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      data: JSON.stringify(datas),
      type: "json",
      onComplete(response, headers, xhr) {
        const info = response;
        info["status"] = xhr.status;
        info["response"] = JSON.parse(xhr.response);
        console.log("✅ _3dSwym_sendDirectMessageData => ", info);
        if (onDone) onDone(info);
      },
      onFailure(response, headers) {
        const info = response;
        info["msg"] = headers.errormsg;
        info["errCode"] = headers.errorcode;
        console.log("❌ sendDirectMessage => ", info);
        if (onError) onError(info);
      },
    });
  });
}

/**
 * @description La fonction `formatedMessage` renvoie un message formaté avec la date et l'heure actuelles.
 * @param {String} message - Le paramètre `message` est une chaîne qui représente le contenu du message que vous souhaitez envoyer.
 *
 * @returns un message formaté avec la date et l'heure actuelles. Le message est enveloppé dans une balise de paragraphe, suivie d'un saut de ligne et d'une règle horizontale.
 *   En dessous, il comprend une phrase indiquant quand le message a été envoyé, y compris la date et l'heure.
 *
 */
function formatedMessage(message) {
  const _dates = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  return `<p>${message} </p>
  <br/>
  <hr/>
  <p><u>envoyer :</u>Le <b>${_dates} à ${time}</b></p>`;
}

export default {
  _3DSwym_getAllCommunities,
  _3DSwym_getMembersCommunity,
  _3DSwym_getIdeaStatusMaturity,
  _3DSwym_buildDirectMessage,
  _3DSwym_findCommunityToInstantMSG,
  _3DSwym_sendMessageData,
};
