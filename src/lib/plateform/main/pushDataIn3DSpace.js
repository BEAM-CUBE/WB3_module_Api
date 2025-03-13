import { _3DSpace_get_csrf, _3DSpace_file_update } from "./3dspace_api";

/**
 * @description La fonction « pushDataIn3DSpace » est utilisée pour pousser les données dans le 3DSpace à l'aide
 * des informations d'identification et de l'ID d'objet fournis.
 * @param {Object} credentials - Un objet contenant les informations d'identification nécessaires à
 * l'authentification dans une fonction interne(_3DSpace_get_downloadTicket_multidoc). Il doit avoir les propriétés suivantes: space, token, tenant
 * @param {String} [credentials.space] - L'URL du serveur sur lequel l'API est déployée.(ex: 3DSpace :(https://r1132100968447-eu1-space.3dexperience.3ds.com/enovia) , 3DSwym, 3DCompass...)
 
 * @param {Object} dataBase - Le paramètre `dataBase` est un objet qui contient les données que vous souhaitez
 * transférer dans l'espace 3D. Il sera converti au format JSON et enregistré sous forme de fichier
 * dans l'espace 3D.
 * @param {String} objectId - Le paramètre objectId est l'identifiant unique de l'objet dans l'espace 3D où les
 * données seront poussées.
 * @param {Function} [onDone] - Le paramètre onDone est une fonction de rappel qui sera appelée lorsque les
 * données seront correctement poussées vers l'espace 3D. Il faut un argument, qui est le résultat de
 * l'opération.
 * @param {Function} [onError] - Le paramètre `onError` est une fonction de rappel qui sera appelée si une erreur
 * survient lors de l'exécution de la fonction `pushDataIn3DSpace`. Il vous permet de gérer et de
 * répondre à toute erreur pouvant survenir.
 */
export function pushDataIn3DSpace(
  credentials,
  dataBase,
  objectId,
  onDone = undefined,
  onError = undefined
) {
  const jsonFile = new Blob([JSON.stringify(dataBase)], { type: "text/plain" });

  credentials = { ...credentials, objID: objectId };
  _3DSpace_get_csrf(
    credentials,
    (data) => {
      console.log("_3DSpace_get_csrf | onDone | data", data);
      const fileId = data.data[0].relateddata.files[0].id;
      const fileName =
        data.data[0].dataelements.secondaryTitle !== ""
          ? data.data[0].dataelements.secondaryTitle
          : data.data[0].dataelements.title;

      _3DSpace_file_update(
        credentials,
        objectId,
        fileId,
        jsonFile,
        fileName,
        (result) => {
          if (onDone) onDone(result);
        },
        (err) => {
          if (onError) onError(err);
        }
      );
    },
    (error) => {
      console.log("En cas d'erreur nous avons :", error);
      alert("Erreur lors de la sauvegarde, Veuillez réessayez");
      if (onError) onError(error);
    }
  );
}
