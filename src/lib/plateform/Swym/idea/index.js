import { _httpCallAuthenticated } from "../../main/3dexperience_api";
import { _3DSwym_get_Token } from "../3dswym_api";
/*
 * @exemple dataTest
 */
const dataTest = {
  title: "TEST DEV COMMUNITY IDEA", // titre du post
  community_id: "YXdA5x4DSUKtlAi2wmnyTA", // STATUT PROJETS - Phase commerciale,  tenant PIVETEAU TEST
  community_title: "TEST DEV COMMUNITY", // Possibilité de recherche par titre de la communauté (option)
  idee_id: "THhRI8rlQNWKRxpv3Xqqug", // id de l'idee qui est créer au post (_3dSwym_postIdea)
};

/**
 * @description La fonction `_3DSwym_postIdeaTemplate` est utilisée pour publier une idée sur une communauté 3DSwym en utilisant les informations d'identification et les données fournies.
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}

 * @param {Array} credentials.swymCommunities tableau des communautés issue de la fonction `_3DSwym_getAllCommunities`
 * @param {Object} data - Le paramètre `data` est un objet qui contient les propriétés suivantes: `title`, `community_id` et `community_title` Ce dernier est optionnel.
 * @param {String} data.title - Le titre de l'idée.
 * @param {String} data.community_id - L'ID de la communauté sur laquelle l'idée doit être publiee.(ex: "YXdA5x4DSUKtlAi2wmnyTA")
 * @param {String} data.community_title - Le titre de la communauté sur laquelle l'idée doit être publiee.(optionnel, ex: TEST DEV COMMUNITY)
 * @param {String} data.text_html - Le message HTML de l'idée (Optionnel sur les tenants Piveteau Prod et test)
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la fonction `_3DSwym_postIdeaTemplate` terminera avec succès son exécution. Il prend un argument, « info », qui contient les données de réponse de l'appel API.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une erreur lors de l'exécution de la fonction `_3DSwym_postIdeaTemplate`. Il s'agit d'un paramètre facultatif, donc s'il n'est pas fourni, il sera par défaut « non défini ».
 *
 */
export function _3DSwym_postIdeaTemplate(
  credentials,
  data,
  onDone = undefined,
  onError = undefined
) {
  const URL = `${credentials.space}/api/idea/add`;

  const findByID = credentials.swymCommunities.find(
    (commu) => commu.id === data.community_id
  );
  const findByTitle = credentials.swymCommunities.find(
    (commu) => commu.title.toLowerCase() === data.community_title.toLowerCase()
  );

  const formatedData = {
    params: {
      title: data.title, // String, le nom de l'affaire
      community_id: findByID?.id !== undefined ? findByID.id : findByTitle.id, // String, l'id de la communauté
      message: templateAffaireMessage(data.text_html), // STRING =>  le contenue du message doit être au format HTML
      published: 1, // 1 publier, 0 non publier
    },
  };

  _3DSwym_get_Token(credentials, (token) => {
    const headers = {
      "Content-type": "application/json;charset=UTF-8",
      Accept: "application/json",
      "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
    };

    _httpCallAuthenticated(URL, {
      method: "POST",
      headers: headers,
      data: JSON.stringify(formatedData),
      type: "json",
      onComplete(response, headers, xhr) {
        const info = JSON.parse(response);
        info["status"] = xhr.status;
        info["response"] = xhr.response;
        if (onDone) onDone(info);
      },
      onFailure(response, headers, xhr) {
        const info = response;
        info["status"] = headers.status;
        info["response"] = headers.errormsg;
        if (onError) onError(info);
      },
    });
  });
}

/**
 * @description La fonction `_3dswym_postIdea` est utilisée pour publier une idée dans une communauté 3DExperience.
 *
 * @param {Object} [credentials] - Le paramètre `credentials` est un objet
 * @param {String} [credentials.community_id] - Le paramètre `credentials.community_id` est un String qui contient l'id de la communauté dans laquelle on souhaite publier l'idée.
 * @param {String} [credentials.message] - Le paramètre `credentials.message` est un String en format HTML.
 * @param {String} [credentials.title] - Le paramètre `credentials.title` est un String qui l'entête de l'idée.
 * @param {String} [credentials.baseURL] - Le paramètre `credentials.baseURL` est la racine du 3DSwym (tenant compris).
 * @param {String} [credentials.swymCommunities] - Le paramètre `credentials.swymCommunities` est la racine du 3DSwym (tenant compris).
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque l'idée
 * sera publiée avec succès. Il prend un argument, «info», qui contient les données de réponse du
 * serveur.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3dswym_postIdea`. Il vous permet de gérer toutes les
 * erreurs qui surviennent et d'effectuer toutes les actions nécessaires.
 */
export function _3DSwym_postIdea(
  credentials,
  onDone = undefined,
  onError = undefined
) {
  const URL = { base: credentials.baseURL, uri: "/api/idea/add" };

  const findByID = credentials.swymCommunities.findIndex(
    (commu) => commu.id === credentials.community_id
  );

  if (findByID === -1) {
    console.log(
      "la communauté n'existe pas dans la liste des communautés du Swym"
    );
    return;
  }

  const body = {
    params: {
      title: credentials.title, // String, le nom de l'affaire
      community_id: credentials.community_id, // String, l'id de la communauté
      message: credentials.message, // templateAffaireMessage(), // STRING =>  le contenu du message doit être au format HTML
      published: 1, // 1 publier, 0 brouillon
    },
  };

  _3DSwym_get_Token((token) => {
    const headerOptions = {
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
      },
      method: "POST",
      data: JSON.stringify(body),
      onComplete(response, headers, xhr) {
        const info = { response };
        if (typeof info.response === "string") {
          info["response"] = JSON.parse(info.response);
        }
        info["status"] = xhr.status;

        if (onDone) onDone(info);
      },
      onFailure(response, headers, xhr) {
        if (onError) onError({ response, headers, xhr });
      },
    };

    _httpCallAuthenticated(URL.base + URL.uri, headerOptions);
  });
}

/**
 * @description La fonction `_3DSwym_deleteIdea` est utilisée pour supprimer une idée dans une communauté 3DExperience en utilisant les informations d'identification et les données fournies.
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 
 * @param data - Le paramètre `data` est un objet qui contient les propriétés suivantes:
 * `community_id` et 'idee_id'
 * @param {String} data.community_id - L'ID de la communauté sur laquelle l'idée doit être supprimée.(ex: "YXdA5x4DSUKtlAi2wmnyTA")
 * @param {String} data.idee_id - L'ID de l'idée que vous souhaitez supprimer (ex: "THhRI8rlQNWKRxpv3Xqqug")
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * suppression de l'idée sera terminée avec succès. Il prend un argument, «info», qui contient des
 * informations sur la réponse du serveur.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_deleteIdea`. Il vous permet de gérer et de
 * traiter les informations d'erreur.
 */
export function _3DSwym_deleteIdea(
  credentials,
  data,
  onDone = undefined,
  onError = undefined
) {
  const URL = `${credentials.space}/api/idea/delete`;
  const formatedData = {
    params: {
      community_id: data.community_id,
      ideationIds: [data.idee_id],
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
      data: JSON.stringify(formatedData),
      type: "json",
      onComplete(response, headers, xhr) {
        const info = response;
        if (onDone) onDone(info);
      },
      onFailure(response, headers, xhr) {
        const info = response;
        info["status"] = headers.status;
        info["response"] = headers.errormsg;
        if (onError) onError(info);
      },
    });
  });
}

/**
 * @description Cette fonction JavaScript récupère une idée SWYM à l'aide des informations d'identification et de l'ID de publication fournis.
 *
 * @param {Object} [credentials] - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} [credentials.space] - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 
 * @param {String} [credentials.idPost] - L'identifiant de la publication ou de l'idée que vous souhaitez récupérer. Si aucun identifiant n'est fourni, il s'agira par défaut de l'identifiant de l'idée de modèle. (actuellement => Piveteau prod :"tFtz0G4MR6qNtKgJjNfTog", Piveteau test :"Qpv3HN-tTDOsU-7_c5DnDg").
 *
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la requête API sera terminée avec succès. Il prend un argument, « info », qui contient les données de réponse de l'appel API. (info.msg : template récupérer lors de la création d'une Affaire et utiliser dans la fonction `_3DSwym_postIdeaTemplate()`).
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_getOneIdea`. Il vous permet de gérer et de
 * traiter l'erreur de manière personnalisée.
 */
export function _3DSwym_getOneIdea(
  credentials,

  onDone = undefined,
  onError = undefined
) {
  // // Tenant PIVETEAU TEST template id || tenant PIVETEAU PROD
  // const templateIdeaId =
  //   credentials.tenant.toLowerCase() === "r1132101716373"
  //     ? "tFtz0G4MR6qNtKgJjNfTog"
  //     : credentials.tenant.toLowerCase() === "r1132101286859"
  //     ? "Qpv3HN-tTDOsU-7_c5DnDg"
  //     : "Template_d'idée_à_créer"; // template créer à la creation d'une Affaire
  // if (idPost === "") {
  //   idPost = templateIdeaId;
  // }

  const URL = `${credentials.space}/api/idea/get`;
  if (credentials.idPost === "") {
    const message =
      "☠️ idPost est vide, vous devez renseigner un identifiant de post";
    throw new Error(`Erreur sur cette requête : ${URL}`, { cause: message });
  }

  const datas = {
    params: {
      id: credentials.idPost,
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

      onComplete(response) {
        const info = { response };

        if (onDone) onDone(info);
      },
      onFailure(response) {
        const info = response;
        info["status"] = headers.status;
        info["response"] = headers.errormsg;
        if (onError) onError(info);
      },
    });
  });
}
/**
 * @description `_3DSwym_editIdea` edit une idée dans 3DSwym.
 *
 * @param   {Object}  [credentials]  Objet contenant les informations du besoin de la requête.
 * @param   {String}  [credentials.space]  - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param   {String}  [credentials.post_id]  Id du post à rééditer
 * @param   {String}  [credentials.title]  titre de l'idée
 * @param   {String}  [credentials.message] Message de l'idée en format HTML (texte balisé)
 * @param   {String}  [credentials.status_id] Id du status(visible dans les devtools au niveau de l'id du balisage, dans les paramètres de l'id du post)
 * @param   {String}  [credentials.status_comment] nomination du statut.
 * @param   {Function}  onDone       [onDone description]
 * @param   {Function}  onError      [onError description]
 *
 * @return  {Void}
 */
export function _3DSwym_editIdea(credentials, onDone, onError) {
  const URL = {
    base: `${credentials.space}/api/idea/edit`,
    uri: "/api/idea/edit",
  };

  const body = {
    params: {
      out: "false",
      id: credentials.post_id,
      title: credentials.title,
      community_id: credentials.community_id,
      status_comment: credentials.status_comment,
      status_id: credentials.status_id,
      message: credentials.message,
      published: "1",
    },
  };
  console.log("body", body);
  _3DSwym_getToken((token) => {
    const headerOptions = {
      method: "POST",
      headers: {
        "X-DS-SWYM-CSRFTOKEN": token.result.ServerToken,
        "Content-type": "application/json;charset=UTF-8",
      },
      data: JSON.stringify(body),
      onComplete(response) {
        const info = JSON.parse(response);

        if (onDone) onDone(info);
      },
      onFailure(response) {
        if (onError) onError(response);
      },
    };
    _httpCallAuthenticated(URL.base + URL.uri, headerOptions);
  });
}

/**
 * @description La fonction `_3DSwym_get_AllSWYMIdeas` récupère toutes les idées SWYM en utilisant les informations d'identification fournies et les paramètres facultatifs.
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles que « token », « space », « tenant » et « ctx ».
 * @param {String} credentials.space - (3DSwym) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant
 * @example {tenant:"R1132100968447"}
 * @param {Object} [data] - Le paramètre `data` est un objet qui contient des données supplémentaires pour la requête API. Il possède les propriétés suivantes :
 * @param {String} data.community_id - L'ID de la communauté sur laquelle l'idée doit être recherchée.(ex: "YXdA5x4DSUKtlAi2wmnyTA")
 * @param {Number} data.limit - Le nombre d'idées à renvoyer (optionnel, par défaut 10 (10 premières idées))
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque la
 * requête API sera terminée avec succès. Il prend un argument, «info», qui correspond aux données de
 * réponse de l'API.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSwym_get_AllSWYMIdeas`. Il est facultatif et peut être
 * indéfini. S'il est fourni, il sera appelé avec les informations d'erreur sous forme de
 */
export function _3DSwym_get_AllSWYMIdeas(
  credentials,
  data = dataTest,
  onDone = undefined,
  onError = undefined
) {
  const URL = {
    uri: "/api/idea/list",
    comId: `/community_id/${
      credentials.tenant.toLowerCase() === "r1132101716373"
        ? data.community_id
        : "bgnIsG74SUWswyGzS6NC6g"
    }`,
    limit: `/limit/${data.limit ? data.limit : 10}`,
  };
  const url = `${credentials.space}${URL.uri}${URL.comId}${URL.limit}`;
  _3DSwym_get_Token(credentials, (token) => {
    _httpCallAuthenticated(url, {
      method: "GET",
      headers: {
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

function templateAffaireMessage(txt) {
  // TEMPLATE AFFAIRES
  if (!txt || txt === "") {
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
    return txt;
  }
}
