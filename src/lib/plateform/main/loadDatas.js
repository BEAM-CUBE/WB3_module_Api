import {
  _3DSpace_download_doc,
  _3DSpace_download_multidoc,
  _3DSpace_get_csrf,
  _3DSpace_csrf,
} from "./3dspace_api";

let listObjectId, datas;

const mixedDatas = [];

/**
 * @description La fonction `get_3DSpace_csrf` récupère un jeton CSRF du 3DSpace en utilisant les  informations d'identification fournies.(Anciennement loadDatas()) avec ou sans objID
 *
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici' « objID », « space ».
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.objID - Le paramètre objID correspond à un object ID contant les objets Id des bases de données)(se base sur un tenant).
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le jeton
 * CSRF sera récupéré avec succès. Il faut un argument, qui est la valeur du jeton CSRF.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée si une erreur
 * survient lors de l'exécution de la fonction `get_3DSpace_csrf`. C'est un paramètre facultatif, donc
 * s'il n'est pas fourni, la fonction ne fera rien en cas d'erreur.
 */
export async function get_3DSpace_csrf(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  if (credentials.objID && credentials.objID !== "") {
    _3DSpace_get_csrf(
      credentials,
      (response) => {
        if (onDone) onDone(response);
      },
      (err) => {
        if (onError) onError(err);
      },
    );
  } else if (credentials.objID === null || credentials.objID === "") {
    _3DSpace_csrf(
      credentials,
      (rep) => {
        const msg = "Pas d'objID, ou invalide";
        const info = { rep, msg };
        if (onDone) onDone(info);
      },
      (err) => {
        const msg = "Pas d'objID et erreur sur le Space";
        const infos = { msg, err };
        if (onError) onError(infos);
      },
    );
  }
}

/**
 * @description La fonction `getDatasByTenant` est une fonction asynchrone qui télécharge une liste de documents à partir du 3DSpace à l'aide des informations d'identification fournies (un ObjectId) et appelle le rappel `onDone`
 * avec les données téléchargées ou le rappel `onError` avec une erreur le cas échéant. (anciennement getDocuments())

 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant 
 * @example {tenant:"R1132100968447"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token) (get_3DSpace_csrf())
 * @param {String} credentials.objID - object Id contenant une liste d'object IDs.
 * @param {Function} [onDone] - Le paramètre onDone est une fonction de rappel qui sera appelée lorsque les
 * données seront téléchargées avec succès. Il faut un argument, qui correspond aux données
 * téléchargées.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée si une erreur
 * survient lors de l'exécution de la fonction `_3DSpace_download_doc`. Il vous permet de gérer et de
 * répondre à toute erreur pouvant survenir.
 */
export async function getDatasByTenant(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  console.log("getDatasByTenant (getDocuments)", credentials);

  await _3DSpace_download_doc(
    credentials,
    (data) => {
      const _datas = {};
      _datas["obj"] = data;
      console.log("getDatasByTenant (getDocuments) _datas", _datas);
      onDone && onDone?.(_datas);

      // getDatasFrom3DSpace(
      //   credentials,
      //   (reponse) => {

      //     _datas["datas"] = reponse;

      //     if (onDone) onDone(_datas);
      //   },
      //   (err) => {
      //     if (onError) onError(err);
      //   },
      // );
    },
    (err) => {
      onError && onError?.(err);
    },
  );
}

/**
 * @description La fonction `getDatasFrom3DSpace` récupère les données d'un espace 3D en utilisant les informations
 * d'identification fournies et appelle le rappel `onDone` avec les données récupérées ou le rappel
 * `onError` avec une erreur le cas échéant.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
 * @param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant
 * @example {tenant:"R1132100968447"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param {ArrayOfObject} credentials.objIds - Tableau d'objets des objets Id des bases de données et leur nom.(ex: credentials.objIds=[{objID:"xxx",name:"xxx"},{objID:"xxx",name:"xxx"}] ) (name disponible dans le module :
 * - dbClients,
 * - dbCatalogs,
 * - dbProjets )
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque toutes
 * les données auront été téléchargées avec succès depuis l'espace 3D. Il faut un argument, qui est un
 * tableau d’objets. Chaque objet du tableau représente un document téléchargé et possède deux
 * propriétés: le nom du document
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée s'il y a une
 * erreur lors de l'exécution de la fonction `_3DSpace_download_doc`. Il vous permet de gérer et de
 * répondre à toute erreur qui se produit.
 */
export function getDatasFrom3DSpace(
  credentials,
  onDone = undefined,
  onError = undefined,
) {
  const bbds = [];
  if (
    !credentials.objIds &&
    !Array.isArray(credentials.objIds) &&
    credentials.objIds.length === 0
  ) {
    console.warn("la liste est vide ou n'est pas un tableau");
    return;
  }
  credentials.objIds.forEach((obj, i) => {
    _3DSpace_download_doc(
      credentials,
      obj.objID,
      (data) => {
        bbds.push({ [obj.name]: data });
        if (obj.name === "dbProjets") {
          listObjectId = data.affaires.map((aff) => {
            return aff.objectID;
          });
          dataMixing(credentials, datas);
        }
        if (i === credentials.objIds.length - 1) {
          if (onDone) onDone(bbds);

          delete credentials.objIds;
          delete credentials.datas;
        }
      },
      (err) => {
        if (onError) onError(err);
      },
    );
  });
}

/**
 * @description La fonction `dataMixing` prend en compte les informations d'identification, les données et les
 * rappels facultatifs, télécharge les données à partir d'un espace 3D, les mélange avec les données
 * d'entrée et renvoie les données mélangées.
 * @param {Object} credentials - Un objet contenant les informations d'identification requises pour authentifier
 * la demande. Il inclut généralement des propriétés telles qu'ici « token » et « space ».(ex: credentials.space, credentials.tenant, credentials.token...).
@param {String} credentials.space - (3DSpace) L'URL du serveur sur lequel l'API est déployée.(3DSpace, 3DSwym, 3DCompass,...etc)
 * @example pour le 3DSpace {space:"https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia"}
 * @param {String} credentials.tenant - le tenant courant 
 * @example {tenant:"R1132100968447"}
 * @param {String} credentials.token - Le paramètre token est le jeton CSRF. (headers ex: ENO_CSRF_TOKEN:token)
 * @param _datas - Le paramètre `_datas` est un tableau d'objets ID d'Affaires
 * @param {Function} [onDone] - Le paramètre `onDone` est une fonction de rappel qui sera appelée lorsque le
 * processus de mélange des données sera terminé avec succès. Il prend un argument, `mixedDatas`, qui
 * est un tableau contenant les données mixtes.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée en cas
 * d'erreur lors du processus de mélange des données. Il faut un argument, qui est l'objet d'erreur.
 */
export function dataMixing(
  credentials,
  _datas,
  onDone = undefined,
  onError = undefined,
) {
  _3DSpace_download_multidoc(
    credentials,
    listObjectId,
    (result) => {
      const copyData = [..._datas];
      copyData.find((e) => e.objectID === result.objectId)["data"] =
        result.data;
      datas = copyData;

      mixedDatas.push(result.data);
      if (onDone) onDone(mixedDatas);
    },
    (err) => {
      if (onError) onError(err), console.log(err);
    },
  );
}
