/**
 * @description `chunkArray` Divise un tableau en plus petits blocs et appelle une fonction fournie sur chaque bloc.
 *
 * @param {Object} obj - Un objet contenant le tableau à diviser, la taille de chaque bloc,et la fonction à appeler sur chaque bloc.
 * @param {Array} obj.credentials - les données de base pour la fonction à appeler sur chaque bloc.(space, token...)
 * @param {Array} obj.myArray - Le tableau à diviser.
 * @param {number} obj.chunk - La taille voulue de chaque bloc.
 * @param {Function} obj.fn_to_call - La fonction à appeler sur chaque bloc.
 * @return {void} Cette fonction ne renvoie rien.
 */
export function chunkArray(obj, getResponse, getError) {
  const { credentials, myArray, chunk, fn_to_call } = obj;

  const chunks = [];
  for (let i = 0; i < myArray.length; i += chunk) {
    const arrayChunks = myArray.slice(i, i + chunk);
    chunks.push(arrayChunks);
  }

  loopingChunk(
    { credentials, chunks, initLoop: 0, fn: fn_to_call },
    (rep) => {
      if (getResponse) getResponse(rep);
    },
    (err) => {
      if (getError) getError(err);
    }
  );
}

/**
 * @description `loopingChunk` Exécute une boucle sur un tableau de chunks, en appelant une fonction fournie sur chaque chunk.
 *
 * @param {Object} obj - Un objet contenant le tableau de chunks, l'index de démarrage de la boucle et la fonction à appeler sur chaque chunk.
 * @param {Array} obj.credentials - les données de base pour la fonction à appeler.
 * @param {Array} obj.chunks - Le tableau de chunks sur lequel effectuer la boucle.
 * @param {number} obj.initLoop - L'index de démarrage de la boucle.
 * @param {Function} obj.fn - La fonction à appeler sur chaque chunk. La fonction doit prendre trois arguments : le chunk actuel, une fonction de rappel, et deux fonctions de rappel facultatives pour gérer les réponses de succès et d'erreur.
 * @return {void} Cette fonction ne renvoie rien.
 */
function loopingChunk(obj, onDone, onError) {
  const { credentials, chunks, initLoop, fn } = obj;
  const loop = (i) => {
    fn(
      credentials,
      chunks[i],
      () => {
        i++;
        if (i < chunks.length) {
          loop(i);
        }
      },
      (response) => {
        if (onDone) {
          onDone(response);
        }
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );
  };
  loop(initLoop);
}
