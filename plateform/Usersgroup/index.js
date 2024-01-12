import { _httpCallAuthenticated } from "@/plugins";
import { mainStore } from "@/store";

//LINK - https://media.3ds.com/support/documentation/developer/Cloud/en/English/CAAi3DXUGREST/UsersGroup_v1.htm#
//!SECTION, Pour faire des modification de UG il faut être OWNER

// URI de test sur le tenant PIVETEAU_TEST:
const _uri = "uuid:3fcb61f2-6417-476d-8a9c-a16fb888771e";

const topHeader = {
  "Content-Type": "application/json",
  Accept: "application/json,text/javascript,*/*",
};

/**
 * La fonction `createUserGroups` crée un nouveau groupe d'utilisateurs avec les détails spécifiés et
 * envoie une requête POST au serveur.
 * ### Attention, l'indexation met du temps, de plus, il faut aussi affecter un owner au groupe nouvellement créer (utiliser `patchUserGroupsControl()`).
 */
export function createUserGroups() {
  const store = mainStore();
  const { _usersgroup, currentUser } = store;
  const URL = {
    URIUGr: "/3drdfpersist/resources/v1/usersgroup",
  };
  const url = `${_usersgroup}${URL.URIUGr}`;
  // console.log(currentUser);
  // groups et title sont obligatoire
  const templateData = {
    groups: [
      {
        title: "Nouveau groupe DEV", // entre 3 et 128 caractères, obligatoire.
        description: "Groupe pour les nouveaux DEVs", // 512 caractères max
        // uri: "uuid:" + UUID(), // peu être aussi généré par la plateforme
        members: [
          // 100 emails max
          currentUser.email,
          "samuel.mureau@beam3.fr",
          "vincent.talgorn@beam3.fr",
          "remi.simeon@beam3.fr",
        ],
        pending_members: [], // 100 emails max, personnes non inscrites sur la plateforme.
        sharing: "owner", // owner/manager/viewer
        visibility: "public", //  public ou private
      },
    ],
  };

  _httpCallAuthenticated(url, {
    method: "POST",
    headers: topHeader,
    data: JSON.stringify(templateData),
    onComplete(response) {
      // Attention l'indexation met du temps
      console.log("response ", JSON.parse(response));
    },
    onFailure(err) {
      console.log(err);
    },
  });
}

/**
 * La fonction `getComplementUG` effectue une requête GET vers un URI spécifique avec certaines options
 * et en-têtes, et enregistre la réponse ou toute erreur.
 * @param {String} [uri] - Le paramètre `uri` est l'identifiant de la ressource pour laquelle on souhaite
 * récupérer le groupe d'utilisateurs complémentaire. (ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 */
export function getComplementUG(uri = _uri) {
  console.log("getComplementUG");
  const store = mainStore();
  const { _usersgroup, currentTenant } = store;
  const baseURL = _usersgroup;
  const URI = `/3drdfpersist/v1/resources/${uri}`;
  const OPTs = `?$mask=dsaccess:Mask.GroupUI.Properties&tenant=dstenant:${currentTenant}`;
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
      console.log("response ", JSON.parse(response));
    },
    onFailure(err) {
      console.log(err);
    },
  });
}

/**
 * La fonction `getUsersGroupRules` effectue une requête HTTP GET pour récupérer une liste de
 * responsabilités de groupe pour un groupe d'utilisateurs.
 */
export function getUsersGroupRules() {
  const store = mainStore();
  const { _usersgroup, currentTenant } = store;
  const baseURL = _usersgroup;
  const URI =
    "/3drdfpersist/resources/v1/option-sets/dsusergroup:ListOfGroupResponsibilities/options";
  const OPTS = `?tenant=dstenant:${currentTenant}`;
  const OPTsH = {
    method: "GET",
    Accept: "application/json,*/*,test/javascript",
  };
  const URL = `${baseURL}${URI}${OPTS}`;

  _httpCallAuthenticated(URL, {
    OPTsH,
    onComplete(response) {
      console.log("Rules response ", JSON.parse(response));
    },
    onFailure(err) {
      console.log(err);
    },
  });
}

/**
 * La fonction `getUserGroupsList` récupère une liste de groupes d'utilisateurs d'un serveur et
 * effectue certaines opérations sur les données.
 */
export function getUserGroupsList() {
  const store = mainStore();
  const { _usersgroup, addUserGroupsList, currentUser } = store;
  const URI = "/3drdfpersist/resources/v1/usersgroup";
  const opt =
    "?select=uri,title,description,owner,members,pending_members,creation_date,modification_date,visibility";
  const url = `${_usersgroup}${URI}${opt}`;
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
        const UG = repUG.groups.filter((element) => {
          return element.uri.startsWith("uuid:");
        });
        addUserGroupsList(UG);
        if (currentUser && Object.keys(currentUser).length > 0) {
          console.log("UG => ", UG);
          console.log("*** repUG ***", repUG);
          const iamOwner = UG.filter((element) => {
            return element.owner === currentUser.email;
          });
          const iamMember = UG.filter((element) => {
            return element.members.includes(currentUser.email);
          });
          const iam = iamOwner.concat(iamMember);
          console.log("%c iamOwner & iamMember", "color:blue", iam);
          getUsersGroupRules();
        }
      },
      onFailure(err) {
        console.log(err);
      },
    });
  } catch (error) {
    console.log(error);
  }

  getComplementUG();
}

/**
 * La fonction `deleteUserGroups` est utilisée pour supprimer un groupe d'utilisateurs en effectuant
 * une requête DELETE à un URI spécifié.
 * @param {String} [uri] - Le paramètre `uri` est l'identifiant unique du groupe d'utilisateurs qui doit être
 * supprimé.
 */
export function deleteUserGroups(uri = _uri) {
  const store = mainStore();
  const { _usersgroup } = store;
  const URI = "/3drdfpersist/resources/v1/usersgroup";
  const url = `${_usersgroup}${URI}/${uri}`;
  console.log("j'efface le GU", url);

  const opts = {
    method: "DELETE",
  };
  _httpCallAuthenticated(url, opts);
}

/**
 * @description
 * La fonction `patchUserGroups` est utilisée pour mettre à jour les groupes d'utilisateurs en envoyant
 * une requête PATCH au serveur avec les données spécifiées.
 * @param [uri] - Le paramètre `uri` est l'identifiant du groupe d'utilisateurs que vous souhaitez
 * patcher. Il est utilisé pour construire l'URL de la requête PATCH. (ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 */
export function patchUserGroups(uri = _uri) {
  const store = mainStore();
  const { _usersgroup, currentTenant } = store;
  const URL = {
    URITI: "/3drdfpersist/resources/v1/template-instances",
    URIUGr: "/3drdfpersist/resources/v1/usersgroup",
    nextURICh: "/characteristics",
    nextURIGr: "/group",
    nexURImem: "/members",
    OPTsTI: `?$mask=dsaccess:Mask.GroupUI.Properties`,
    OPTsTenant: `tenant=dstenant:${currentTenant}`,
  };

  // Le format des datas est obligatoire : [{}]
  // op : add, replace, remove
  // field : members[], pending_members[], title, description, owner, visibility
  // value : string ou array

  const dataMembers = [
    {
      op: "add",
      field: "members",
      value: ["samuel.mureau@beam3.fr"],
    },
    {
      op: "replace",
      field: "title",
      value: "BEAM³ R&D - DEV",
    },
  ];

  const baseURL = `${_usersgroup}${URL.URIUGr}/${uri}`; // route de base pour le PATCH (DOC)

  const dataMembersSTR = JSON.stringify(dataMembers);
  console.log("STR", dataMembersSTR);

  _httpCallAuthenticated(baseURL, {
    headers: topHeader,
    method: "PATCH",
    data: dataMembersSTR,
    type: "json",
    onComplete(response) {
      console.log("response patch 0.2 ", response);
    },
    onFailure(err) {
      console.log("erreur 2 patch 0", err);
    },
  });
}

//ANCHOR -  CONTROL (Gestion des propriétaires du groupe)

/**
 * @description La fonction `patchUserGroupsControl` est utilisée pour mettre à jour les paramètres de partage d'un
 * groupe d'utilisateurs dans une application JavaScript.
 * @param {String} [uri] - Le paramètre `uri` est l'identifiant du groupe d'utilisateurs que vous souhaitez patcher. Il est utilisé pour construire l'URL de la requête PATCH.(ex: uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45)
 *
 */
export function patchUserGroupsControl(uri = _uri) {
  const store = mainStore();
  const { _usersgroup } = store;
  const URI = "/3drdfpersist/resources/v1/usersgroup";

  const url = `${_usersgroup}${URI}/${uri}/sharing`;
  //liste des responsabilités : ["dsaccess:Responsibility.Group.MainOwner", "dsaccess:Responsibility.Group.Owner", "dsaccess:Responsibility.Group.Viewer", "dsaccess:Responsibility.Group.Author", "dsaccess:Responsibility.GroupService.Administrator"]
  const datas = [
    {
      op: "add", // add, replace, remove
      path: "/sharing",
      value: {
        agents: ["", "samuel.mureau@beam3.fr", "yan.coquoz@beam3.fr"],
        responsibilities: ["dsaccess:Responsibility.Group.Owner"],
      },
    },
  ];

  _httpCallAuthenticated(url, {
    method: "PATCH",
    headers: topHeader,
    data: JSON.stringify(datas),
    type: "json",
    onComplete(response) {
      console.log("Patch response ", response);
    },
    onFailure(err) {
      console.log(err);
    },
  });
}
/**
 * @description
 * La fonction `readUserGroupControl` récupère les utilisateurs responsables d'un groupe d'utilisateurs
 * en effectuant une requête HTTP GET authentifiée.
 * @param {String} [uri] - Le paramètre `uri` est l'identifiant du contrôle de groupe d'utilisateurs que vous souhaitez lire. (ex: 'uuid:dcad14cc-5bcd-45fd-a54d-246b95047d45')
 *
 */
export function readUserGroupControl(uri = _uri) {
  const store = mainStore();
  const { _usersgroup } = store;
  const URI = "/3drdfpersist/resources/v1/usersgroup";

  const url = `${_usersgroup}${URI}/${uri}/sharing`;
  console.log("je récupère le(s) responsable(s) d'un GU", url);

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
      console.log("response ", JSON.parse(_rep));
    },
    onFailure(err) {
      console.log(err);
    },
  });
}
