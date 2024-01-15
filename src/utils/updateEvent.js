/**
 * @description La fonction `updateEvent` met à jour un tableau d'événements en ajoutant ou en supprimant un
 * événement en fonction d'une condition donnée.
 * @param {Array} events - (store.loadedEvents)Une panoplie d'événements. Chaque événement est un objet avec des propriétés telles que uuid, start, end, etc.
 *
 * @param {Object} data - Le paramètre `data` est un objet qui représente l'événement à mettre à jour.
 * @param {String}[data.uuid] - L'identifiant unique de l'événement.
 * @param {Boolean} [add=true] - Le paramètre "add" est une valeur booléenne qui détermine s'il faut ajouter ou
 * mettre à jour un événement dans le tableau des événements. Si add est vrai, la fonction ajoutera
 * l'événement au tableau s'il n'existe pas déjà. Si add est faux, la fonction mettra à jour
 * l'événement existant dans le tableau
 * @returns le tableau `db` (store.loadedEvents) mis à jour.
 */
async function updateEvent(events, data, add = true) {
  const index = events.events.findIndex((val) => val.uuid === data.uuid);

  if (index === -1) {
    events.events.push(data);
  } else {
    if (add) events.events[index] = data;
    else events.events.splice(index, 1);
  }

  if (events.length > 0) events.sort((a, b) => a.start - b.start);

  return events;
}
module.exports = { updateEvent };
