import { v4 as uuid } from "uuid";
/**
 * @description La fonction UUID génère un UUID (Universally Unique Identifier) aléatoire.
 * @returns La fonction UUID renvoie un UUID (Universally Unique Identifier) généré aléatoirement à l'aide de la fonction uuid.
 *
 */
export function UUID() {
  return uuid();
}
