const { v4: uuidv4 } = require("uuid");

/* Ce code exporte une fonction par défaut qui génère un identifiant unique à l'aide de la bibliothèque
`uuid`. Lorsque cette fonction est importée dans un autre module, elle peut être appelée pour
générer un nouvel UUID. */
export function UUID() {
  return uuidv4();
}
