# Fonction disponible pour le template BEAM Cube

## Documentation

- Lien de la [documentation](./docs/index.html ) à ouvrir avec l'extension de VScode : `liveserver`
disponible [sur le marcketplace](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

- Sinon sur le site : [La documentation](https://beam-cube.github.io/WB3_module_Api/)

## installation

```sh
npm i -D wb3_module_api
# ou 
yarn add -D wb3_module_api
```

## Mise a jour

```sh
npm run build
# faire les commits (add, commit, push)
npm run b3:publish 
```

## Attention

- Vérifer si vous êtes bien loggé à NPM : `npm whoami`, sinon `npm login`.
- Ne pas oublier de mettre à jour le fichier README.md en cas de modification de la librairie.
- Mettre à jour le widget dans lequel on utilise déjà la librairie.
- En cas de de problèmes de publication, verifier le versioning du `package.json` et du module sur le site NPM, la version du package.json doit être mise à jour et égale à la version du module (NPM).

