import { _httpCallAuthenticated, _3dswym_get_version } from "@/plugins";

import { mainStore } from "@/store";

/*
 * @exemple
 */
const dataTest = {
  title: "TEST DEV COMMUNITY IDEA", // titre du post
  community_id: "YXdA5x4DSUKtlAi2wmnyTA", // STATUT PROJETS - Phase commerciale,  tenant PIVETEAU TEST
  community_title: "TEST DEV COMMUNITY", // Possibilité de recherche par titre de la communauté (option)
  idee_id: "THhRI8rlQNWKRxpv3Xqqug", // id de l'idee qui est créer au post (_3dSwym_postIdea)
};

/**
 * @description
 * La fonction `_3dswym_postIdea` est utilisée pour publier une idée dans une communauté 3DExperience.
 * @param {Object} [data] - Le paramètre `data` est un objet qui contient les propriétés suivantes: `title`, `community_id` et `community_title` Ce dernier est optionnel.
 * @param {Callback} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'idée
 * sera publiée avec succès. Il prend un argument, «info», qui contient les données de réponse du
 * serveur.
 * @param {Callback} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3dswym_postIdea`. Il vous permet de gérer toutes les
 * erreurs qui surviennent et d'effectuer toutes les actions nécessaires.
 */
export function _3dSwym_postIdea(
  data,
  onDone = undefined,
  onError = undefined,
) {
  const store = mainStore();
  const { _3DSwym, swymCommunities } = store;
  const URL = `${_3DSwym}/api/idea/add`;

  const findByID = swymCommunities.find(
    (commu) => commu.id === data.community_id,
  );
  const findByTitle = swymCommunities.find(
    (commu) => commu.title.toLowerCase() === data.community_title.toLowerCase(),
  );

  console.log(findByID, findByTitle);

  const formatedData = {
    params: {
      title: data.title, // String, le nom de l'affaire
      community_id: findByID?.id !== undefined ? findByID.id : findByTitle.id, // String, l'id de la communauté
      message: templateAffaireMessage(), // STRING =>  le contenue du message doit être au format HTML
      published: 1, // 1 publier, 0 non publier
    },
  };
  _3dswym_get_version((token) => {
    const headers = {
      "Content-type": "application/json;charset=UTF-8",
      Accept: "application/json",
      "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
    };
    console.log("j'envois la donnée", formatedData);
    _httpCallAuthenticated(URL, {
      method: "POST",
      headers: headers,
      data: JSON.stringify(formatedData),
      type: "json",
      onComplete(response, headers, xhr) {
        let info = response;
        if (typeof info === "string") {
          info = JSON.parse(info);
        }
        console.log("✔️ postIdea => ", info);
        console.log("✔️ postIdea => ", headers);
        console.log("✔️ postIdea => ", xhr);

        if (onDone) onDone(info);
      },
      onFailure(response, headers, xhr) {
        console.log("☠️ error => ", response);
        console.log("☠️ error => ", headers);
        console.log("☠️ error => ", xhr);
        if (onError) onError(response);
      },
    });
  });
}

/**
 * @description
 * La fonction `_3dSwym_deleteIdea` permet de supprimer une idée dans une communauté 3D Swym.
 * @param {Object} [data] - Le paramètre `data` est un objet qui contient les propriétés suivantes: `community_id` et `ideationIds`
 */
export function _3dSwym_deleteIdea(data) {
  const store = mainStore();
  const { _3DSwym } = store;
  const URL = `${_3DSwym}/api/idea/delete`;
  const formatedData = {
    params: {
      community_id: data.community_id,
      ideationIds: [data.idee_id],
    },
  };
  _3dswym_get_version((token) => {
    _httpCallAuthenticated(URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      data: JSON.stringify(formatedData),
      type: "json",
      onComplete(response, headers, xhr) {
        const info = response;
        console.log("✔️ deleteIdea => ", info);
        console.log("✔️ postIdea => ", xhr.status);
      },
      onFailure(response, headers, xhr) {
        console.log("☠️ error => ", response);
        console.log("☠️ error => ", headers.errormsg);
      },
    });
  });
}

/**
 * @description
 * La fonction `_3DSwym_getSWYMIdea` est utilisée pour récupérer une idée SWYM à l'aide de son ID.
 * @param {String} [idPost] - L'identifiant de la publication, de l'idée que vous souhaitez récupérer depuis la plateforme 3DSwym.
 *  Il est défini sur la valeur par défaut "templateIdeaId" au cas où aucun
 * identifiant spécifique n'est fourni. "templateIdeaId" est basé sur le tenant courant et post sur la communauté "STATUT PROJETS - Phase commerciale" (tenant PIVETEAU TEST) ou "STATUT PROJETS - Phase commerciale" (tenant PIVETEAU)
 * @param {Callback}[onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête sera terminée avec succès. Il prend un argument, «info», qui contient les données de
 * réponse du serveur.
 * @param {Callback}[onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_getSWYMIdea`. Il vous permet de gérer toutes les
 * erreurs qui surviennent et d'effectuer toutes les actions nécessaires.
 */
export function _3DSwym_getSWYMIdea(
  idPost = "",
  onDone = undefined,
  onError = undefined,
) {
  const store = mainStore();
  const { _3DSwym } = store;
  // Tenant PIVETEAU TEST template id || tenant PIVETEAU PROD
  const templateIdeaId =
    store.currentTenant.toLowerCase() === "r1132101716373"
      ? "tFtz0G4MR6qNtKgJjNfTog"
      : store.currentTenant.toLowerCase() === "r1132101286859"
      ? "Qpv3HN-tTDOsU-7_c5DnDg"
      : "Template_d'idée_à_créer"; // template créer à la creation d'une Affaire
  if (idPost === "") {
    idPost = templateIdeaId;
  }

  const URL = `${_3DSwym}/api/idea/get`;
  const datas = {
    params: {
      id: idPost,
    },
  };
  _3dswym_get_version((token) => {
    _httpCallAuthenticated(URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      data: JSON.stringify(datas),
      type: "json",
      onComplete(response) {
        const info = response;
        console.log("1 SWYMIdea ", info);
        store.getTemplateIdeaMSG(info.result.message);
        if (onDone) onDone(info);
      },
      onFailure(response) {
        if (onError) onError(response);
      },
    });
  });
}

/**
 * La fonction `_3DSwym_get_AllSWYMIdeas` récupère une liste d'idées à partir d'un point de terminaison
 * de l'API 3DSwym.
 * @param {Object} [data] - Le paramètre `data` est un objet qui contient les propriétés suivantes: ``community_id`` et `limit` (optionnel, par défaut 50 (50 premiers idées))
 * @param {Callback} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête API sera terminée avec succès. Il prend un argument, « info », qui correspond aux données de
 * réponse de l'API.
 * @param {Callback} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_get_AllSWYMIdeas`. Il vous permet de gérer toutes
 * les erreurs qui surviennent et d'effectuer toutes les actions nécessaires.
 */
export function _3DSwym_get_AllSWYMIdeas(
  data = dataTest,
  onDone = undefined,
  onError = undefined,
) {
  const store = mainStore();
  const { _3DSwym, currentTenant } = store;

  const URL = {
    uri: "/api/idea/list",
    comId: `/community_id/${
      currentTenant.toLowerCase() === "r1132101716373"
        ? data.community_id
        : "bgnIsG74SUWswyGzS6NC6g"
    }`,
    limit: `/limit/${data.limit ? data.limit : 50}`, // Si la limit n'est pas fournie, on la met à 50
  };
  const url = `${_3DSwym}${URL.uri}${URL.comId}${URL.limit}`;
  _3dswym_get_version((token) => {
    _httpCallAuthenticated(url, {
      method: "GET",
      headers: {
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },

      onComplete(response) {
        const info = JSON.parse(response);
        console.log("all SWYMIdeas ", info);
        if (onDone) onDone(info);
      },
      onFailure(response) {
        if (onError) onError(response);
      },
    });
  });
}

function templateAffaireMessage() {
  const store = mainStore();
  const { templateIdeaMSG } = store;
  // TEMPLATE AFFAIRES
  if (templateIdeaMSG === "") {
    const message = `<h2><u>INFORMATIONS AFFAIRE :</u></h2>
  <p><u>|⚠️<em> Merci de respecter l&#39;écriture des tags, en MAJUSCULES, nom complet, pas de caractères</em></u></p>
  <p><u><em>|spéciaux, séparation par &#34;_&#34; si besoin !</em></u></p>
  <p><strong>Référence client </strong>:  <em>
  <a data-predicate="ds6w:who" data-type="internal" class="s6m-tag-link s6m-link">CLIENT</a> 
  </em></p>
  <p><strong>Référence projet </strong>: <em>
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">NOM AFFAIRE</a> 
  <a data-predicate="ds6w:where" data-type="internal" class="s6m-tag-link s6m-link">VILLE</a> 
  <a data-predicate="ds6w:where" data-type="internal" class="s6m-tag-link s6m-link">DPT</a> 
  </em></p>
  <p>&#x1f4dd; <strong>Base documentaire</strong> : LIEN projet</p>
  <p>&#x1f4dd; <strong>Fiche COCLICO</strong> : LIEN projet<em><strong></strong>
  </em></p>
  <p><br /></p>
  <table border="1">
  <tbody>
  <tr><td><strong>Description projet </strong>:
  <br /><br /></td></tr>
  </tbody>
  </table>
  <p><br /></p>
  <p><br /></p>
  <p><strong>Produit :<em> </em></strong><em>
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Hexapli Usiné</a>
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Hexapli MP</a>
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Lamwood</a>
  </em></p>
  <p><strong>Type de Bâtiment :</strong><em>
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Logements</a> 
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">BUP</a> 
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">ERP</a> 
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Plateforme Logistique</a> 
  </em></p>
  <p><strong>Essence :</strong> <em>
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">DOUGLAS</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">PIN</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">MIXTE</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">EPICEA</a> 
  </em></p>
  <p><strong>Qualité : </strong><em>
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">NVI</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">VI1F</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">VI2F</a> 
  </em><strong></strong></p>
  <p><strong>Traitement : </strong><em>
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">PARKA</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">CT2</a> 
  </em></p>
  <p><strong>Type de Paroi : </strong><em>
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Murs Intérieurs</a> 
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Murs Extérieurs</a> 
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Planchers</a> 
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Couverture</a> 
  </em></p>
  <p><em>
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Etanchéité Accessible</a> 
  <a data-predicate="ds6w:what" data-type="internal" class="s6m-tag-link s6m-link">Etanchéité Non-Accessible</a> 
  </em></p>
  <p><strong>Hauteur Dernier Plancher :</strong><em><strong> </strong> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">Hauteur &lt;8m</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">8m&lt; Hauteur &lt;28m</a> 
  <a data-predicate="ds6w:how" data-type="internal" class="s6m-tag-link s6m-link">28m&lt; Hauteur &lt;50m</a> 
  </em></p>
  <h2><br /></h2>
  <h2><u>EQUIPE PIVETEAU :</u></h2>
  <table border="1">
  <tbody>
  <tr><td><strong>Chargé d&#39;Affaires</strong></td><td><br /></td></tr>
  <tr><td><strong>Service études de prix</strong></td><td><br /></td></tr>
  </tbody></table>
  <p>
  </p>`;
    return message;
  } else {
    return templateIdeaMSG;
  }
}
