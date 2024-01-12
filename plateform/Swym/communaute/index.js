import {
  _httpCallAuthenticated,
  _3dswym_get_version,
  _3DSwym_getIdeaStatus,
} from "@/plugins";
import { mainStore } from "@/store";

export function _3dSwim_getAllCommunities(
  token,
  onDone = undefined,
  onError = undefined,
) {
  const store = mainStore();
  const { _3DSwym } = store;
  //FIXME - faire la gestion des limits et des pages
  // 1 faire un 1er appel pour avoir le nombre de résultats
  // 2 par defaut la limit est de 10, et peu aller à 128, au delà on passe sur une autre page
  const URL = `${_3DSwym}/api/community/listmycommunities/limit/100`;

  const communautes = [];

  _httpCallAuthenticated(URL, {
    method: "GET",
    headers: {
      "X-DS-SWYM-CSRFTOKEN": token,
    },
    onComplete(response, headers, xhr) {
      const info = JSON.parse(response);
      const _communities = info.result;
      let count = 0;
      console.log("_3dSwim_getAllCommunities / resp", info);
      // store.updateAllCommunities(_communities);
      _communities.forEach((commu) => {
        const com = {
          description: commu.description,
          id: commu.id,
          title: commu.title,
          owner: commu.owner,
          role: commu.role,
          access: commu.access,
        };

        _3dSwim_getMembersCommunity(
          token,
          commu.id,
          (data) => {
            count++;
            com["members"] = data;
            communautes.push(com);
            if (count === _communities.length) {
              if (onDone) onDone(communautes);
              console.log("communautes => ", communautes);
              store.updateAllCommunities(communautes);
            }
          },
          (err) => onError(err),
        );
      });
    },
    if(onDone) {
      onDone(communautes);
    },
    onFailure(response) {
      if (onError) onError(response);
    },
  });
}

export function _3dSwim_getMembersCommunity(tk, idCommu, onDone, onError) {
  const store = mainStore();
  const { _3DSwym } = store;
  const URL = `${_3DSwym}/api/community/listmembers`;

  const datas = {
    params: {
      page: 1,
      limit: 50, // de 1 à 128
      community_id: idCommu,
    },
  };

  _httpCallAuthenticated(URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Accept: "application/json",
      "X-DS-SWYM-CSRFTOKEN": tk,
    },
    data: JSON.stringify(datas),
    type: "json",
    onComplete(response, headers, xhr) {
      const info = response;
      if (onDone) onDone(info);
    },
    onFailure(response) {
      if (onError) onError(response);
    },
  });
}

export function _3DSwym_getIdeaStatusMaturity(
  onDone = undefined,
  onError = undefined,
) {
  const store = mainStore();
  const { _3DSwym } = store;

  const URL = `${_3DSwym}/api/v2/communities/${"YXdA5x4DSUKtlAi2wmnyTA"}/ideas/statuses`;
  _3dswym_get_version((token) => {
    _httpCallAuthenticated(URL, {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },

      onComplete(response) {
        const info = JSON.parse(response);
        console.log("1 SWYMIdea status ", info);
        if (onDone) onDone(info);
      },
      onFailure(response) {
        if (onError) onError(response);
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
 * @description
 * La fonction `_3dSwym_buildDirectMessage` envoie un message direct à un utilisateur dans une
 * application 3D Swym.
 * @param {Object} [datas] - Le paramètre `datas` est un objet qui contient les propriétés suivantes:
 * @property {ArrayOfString} `receipt` est un tableau de chaines de caractères correspondant aux identifiants des utilisateurs à qui envoyer le message accessible par dans `__listAllContacts.hits` (login) depuis le store.
 * @property {String} 'msg'
 */
export function _3dSwym_buildDirectMessage(datas = contentMSG) {
  const store = mainStore();
  const { _3DSwym, __listAllContacts, currentUser } = store;
  console.log("__listAllContacts", __listAllContacts.hits);
  const _URL = `${_3DSwym}/api/directmessages`;

  const _data = {
    users: [currentUser.login].concat(datas.receipt),
  };

  const MSGData = {
    id_msg: "",
    senderId: currentUser.login,
    senderName: `${currentUser.first_name} ${currentUser.last_name}`,
    msg: formatedMessage(datas.msg),
  };
  let otherCommunity = false;
  _3dSwym_findCommunityToInstantMSG(
    _data.users,
    (rep) => {
      console.log("_3dSwym_findCommunityToInstantMSG callback rep", rep);
      if (rep !== undefined) {
        MSGData["id_msg"] = rep.id;
        otherCommunity = true;
        _3dSwym_sendMessageData(MSGData);
      }
    },
    (err) => {
      otherCommunity = false;
      console.log("_3dSwym_findCommunityToInstantMSG callback", err);
      MSGData["id_msg"] = "";
    },
  );

  if (otherCommunity === false) {
    setTimeout(() => {
      if (otherCommunity === false) {
        _3dswym_get_version((token) => {
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
              console.log("✅ _3dSwym_sendDirectMessage => ", info);

              MSGData["id_msg"] = info.result.id;
              _3dSwym_sendMessageData(MSGData);
            },
            onFailure(response, headers, xhr) {
              const info = response;
              info["msg"] = headers.errormsg;
              info["status"] = headers.status;
              console.log("❌ sendDirectMessage => ", info);

              // ! Il peut y avoir une réponse positive dans l'erreur au cas ou une communication est déjà lancé (status code 409).
              //! Si oui on refait un appel
              // if (Object.keys(headers).includes("result")) {
              //   // MSGData["id_msg"] = headers.result.id;
              //   MSGData["tk"] = token.result.ServerToken;
              //   console.log("🚀 _3dSwym_sendDirectMessageLite 409 => ");
              //   _3dSwym_sendDirectMessageFindCommunity();
              //   // _3dSwym_sendDirectMessageData(MSGData);
              // }
            },
          });
        });
      }
    }, 500);
  }
}

/**
 * La fonction `_3dSwym_findCommunityToInstantMSG` permet de trouver une communauté pour envoyer un
 * message instantané dans une application 3D Swym.
 * @param datas - Le paramètre `datas` est un tableau qui contient les données à utiliser pour trouver une communauté pour envoyer un message instantané.
 *
 * @param onDone - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque
 * l'opération sera terminée avec succès. Il faut un argument, qui est le résultat de l’opération.
 * @param onError - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3dSwym_findCommunityToInstantMSG`. Il est utilisé pour gérer toutes les erreurs qui se produisent et fournir une gestion des erreurs ou des messages d'erreur appropriés à l'utilisateur.
 *
 */
function _3dSwym_findCommunityToInstantMSG(datas, onDone, onError) {
  const store = mainStore();
  const { _3DSwym } = store;

  const URL = `${_3DSwym}/api/directmessages/lite?with_favorites=false`;
  _3dswym_get_version((token) => {
    _httpCallAuthenticated(URL, {
      method: "GET",
      headers: {
        Accept: "application/json,text/javascript,*/*",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      onComplete(response) {
        const info = JSON.parse(response);
        console.log("_3dSwym_sendDirectMessageFindCommunity ", info);

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
      },
    });
  });
}

/**
 * @description
 * La fonction `_3dSwym_sendDirectMessageData` envoie un message direct avec le contenu fourni à l'aide
 * de l'API 3DSwym.
 * @param content - Le paramètre `content` est un objet qui contient les propriétés suivantes:
 */
function _3dSwym_sendMessageData(content) {
  const store = mainStore();
  const { _3DSwym } = store;
  const URL = {
    base: _3DSwym,
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
  _3dswym_get_version((token) => {
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
      },
      onFailure(response, headers) {
        const info = response;
        info["msg"] = headers.errormsg;
        info["errCode"] = headers.errorcode;
        console.log("❌ sendDirectMessage => ", info);
      },
    });
  });
}

function formatedMessage(message) {
  const _dates = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  return `<p>${message} </p>
  <br/>
  <hr/>
  <p><u>envoyer :</u>Le <b>${_dates} à ${time}</b></p>`;
}
