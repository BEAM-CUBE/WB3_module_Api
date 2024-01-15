const { v4: uuidv4 } = require("uuid");

/**
 * La fonction UUID génère un UUID (Universally Unique Identifier) aléatoire.
 * @returns La fonction UUID renvoie un UUID (Universally Unique Identifier) généré aléatoirement à
 * l'aide de la fonction uuidv4.
 */
function UUID() {
  return uuidv4();
}

module.exports = UUID;
