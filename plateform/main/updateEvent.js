import { mainStore } from "@/store";

/**
 * Cette fonction met à jour un événement dans une base de données ou l'ajoute s'il n'existe pas.
 * @param data - Le paramètre data est un objet qui représente un événement à mettre à jour ou à
 * ajouter à la base de données. Il doit avoir un identifiant unique (uuid) et d'autres propriétés
 * telles que les heures de début et de fin, le titre, la description, etc.
 * @param [add=true] - Le paramètre "add" est une valeur booléenne qui détermine si l'objet "data" doit
 * être ajouté au tableau "db.events" ou mis à jour s'il existe déjà. Si "add" est vrai, l'objet "data"
 * sera ajouté ou mis à jour dans le tableau. Si "ajouter" est
 */
export async function updateEvent(data, add = true) {
  const store = mainStore();
  const db = store.loadedEvents;
  const index = db.events.findIndex((val) => val.uuid === data.uuid);

  if (index === -1) {
    db.events.push(data);
  } else {
    if (add) db.events[index] = data;
    else db.events.splice(index, 1);
  }

  if (db.length > 0) db.sort((a, b) => a.start - b.start);

  store.updateLoadedEvents(db);
}
