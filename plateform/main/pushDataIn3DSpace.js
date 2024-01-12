import { mainStore } from "@/store";
import { _3dspace_get_csrf, _3dspace_file_update } from "@/plugins";

/**
 * Cette fonction pousse les données dans le 3DSpace en mettant à jour un fichier dans les données
 * associées d'un objet 3D.
 * @param dataBase - Les données qui doivent être poussées dans le 3DSpace. Il est converti en un
 * fichier JSON et téléchargé dans l'espace.
 * @param objectId - L'ID de l'objet dans le 3DSpace où les données seront poussées.
 */
export async function pushDataIn3DSpace(dataBase, objectId) {
  const store = mainStore();
  const _3DSpace = store._3DSpace;

  const jsonFile = new Blob([JSON.stringify(dataBase)], { type: "text/plain" });

  await _3dspace_get_csrf(
    _3DSpace,
    objectId,
    (data) => {
      const fileId = data.data[0].relateddata.files[0].id;
      const fileName =
        data.data[0].dataelements.secondaryTitle !== ""
          ? data.data[0].dataelements.secondaryTitle
          : data.data[0].dataelements.title;

      _3dspace_file_update(
        _3DSpace,
        objectId,
        fileId,
        jsonFile,
        fileName,
        (result) => {
          store.save(false);
          store.updateWidgetEvent("onPushDataIn3DSpace");
        },
      );
    },
    (error) => {
      console.log("En cas d'erreur nous avons :", error);
      alert("Erreur lors de la sauvegarde, Veuillez réessayez");
      store.save(false);
    },
  );
}
