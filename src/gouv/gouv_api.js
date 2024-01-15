const { DateTime } = require("luxon");
const { couleurs } = require("./colors");

/**
 * Cette fonction récupère une liste de communes en fonction d'un code postal donné à l'aide d'une API
 * d'IGN France.
 * @param {String} cp - Le paramètre `cp` est une chaîne représentant un code postal français. Il est converti
 * en entier à l'aide de `parseInt()` avant d'être utilisé dans la requête API.
 * @param { Function } - onDone est une fonction de rappel qui sera exécutée lorsque l'appel API réussit et
 * renvoie une réponse. Il prend les données de réponse comme argument et peut être utilisé pour gérer
 * les données dans la fonction appelante.
 * @param { Function } - Le paramètre `onError` est une fonction de rappel qui sera exécutée s'il y a une
 * erreur lors de la requête de récupération. Il permet une gestion personnalisée des erreurs et peut
 * être utilisé pour afficher des messages d'erreur ou effectuer d'autres actions en réponse à une
 * erreur.
 */
async function getCommunes(cp, onDone = undefined, onError = undefined) {
  const codePostal = parseInt(cp);
  await fetch(
    "https://apicarto.ign.fr/api/codes-postaux/communes/" + codePostal,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  )
    .then((response) => response.json())
    .then((json) => {
      if (onDone) onDone(json);
    })
    .catch((error) => {
      if (onError) onError(error);
      console.error("Erreur : " + error);
    });
}

/**
 * Il s'agit d'une fonction JavaScript qui utilise l'API-adresse.data.gouv.fr pour rechercher des
 * adresses à partir d'une requête et renvoie les résultats au format JSON.
 * @param { String } query - L'adresse ou la requête d'emplacement à rechercher dans l'API.
 * @param { Function } - onDone est une fonction de rappel qui sera exécutée lorsque l'appel API réussit et
 * renvoie une réponse. Il prend la réponse JSON comme paramètre.
 * @param { Function } - Le paramètre `onError` est une fonction de rappel qui sera exécutée s'il y a une
 * erreur lors de l'appel de l'API. C'est un paramètre optionnel qui peut être passé à la fonction
 * `findAdresse`. S'il est fourni, il recevra l'objet d'erreur comme argument.
 */
async function findAdresse(query, onDone = undefined, onError = undefined) {
  // https://api-adresse.data.gouv.fr/search/?q=
  query = encodeURIComponent(query);
  await fetch(
    "https://api-adresse.data.gouv.fr/search/?q=" + query + "&limit=15",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  )
    .then((response) => response.json())
    .then((json) => {
      if (onDone) onDone(json);
    })
    .catch((error) => {
      if (onError) onError(error);
      console.error("Erreur : " + error);
    });
}

/**
 * Cette fonction récupère les données d'une API du gouvernement français contenant des informations
 * sur les jours fériés et les formate pour les utiliser dans une application de calendrier.
 */
/**
 * La fonction `getDataFromGouvFr` récupère les données de l'API du gouvernement français pour les
 * jours fériés et les formate dans une structure de données spécifique.
 * @param events - Le paramètre `events` est un tableau d'objets représentant des événements. (store.loadedEvents)
 * @param colors - Le paramètre `colors` est un objets représentant des couleurs. (Piveteau)
 * @returns les données formatées, qui incluent les événements récupérés depuis le point de terminaison
 * API "https://calendrier.api.gouv.fr/jours-feries/metropole/". Les événements sont formatés dans une
 * structure spécifique et renvoyés sous forme d'objet.
 */
async function getDataFromGouvFr(events, colors = couleurs) {
  let year = DateTime.now().year;
  const loadedEvents = events;
  const sortedData = [];

  const formatData = (json) => {
    for (let date in json) sortedData.push({ date, comment: json[date] });
  };

  for (let i = year; i <= year + 1; i++) {
    await fetch(
      "https://calendrier.api.gouv.fr/jours-feries/metropole/" + i + ".json",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    )
      .then((response) => response.json())
      .then((json) => {
        formatData(json);
      })
      .catch((error) => console.error("Erreur : " + error));
  }

  const formatedData = () => {
    const data =
      loadedEvents.length === 0
        ? {
            events: [],
          }
        : loadedEvents;
    for (let each of sortedData) {
      const index = data.events.findIndex(
        (event) =>
          event.start === DateTime.fromISO(each.date).toISODate() &&
          event.name === "Férié : " + each.comment,
      );

      if (index === -1)
        data.events.push({
          name: "Férié : " + each.comment,
          start: DateTime.fromISO(each.date).toISODate(),
          end: DateTime.fromISO(each.date).toISODate(),
          color: colors.b3BusinnessDays,
          timed: false,
        });
    }
    return data;
  };

  return formatedData();
}

module.exports = {
  getDataFromGouvFr,
  findAdresse,
  getCommunes,
};
