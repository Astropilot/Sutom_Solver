<p align="center">
🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥<br>
🟥🟦🟡🟡🟡🟦🟡🟦🟡🟦🟡🟡🟡🟦🟡🟡🟡🟦🟡🟦🟡🟦🟥<br>
🟥🟦🟡🟦🟦🟦🟡🟦🟡🟦🟦🟡🟦🟦🟡🟦🟡🟦🟡🟡🟡🟦🟥<br>
🟥🟦🟡🟡🟡🟦🟡🟦🟡🟦🟦🟡🟦🟦🟡🟦🟡🟦🟡🟦🟡🟦🟥<br>
🟥🟦🟦🟦🟡🟦🟡🟦🟡🟦🟦🟡🟦🟦🟡🟦🟡🟦🟡🟦🟡🟦🟥<br>
🟥🟦🟡🟡🟡🟦🟡🟡🟡🟦🟦🟡🟦🟦🟡🟡🟡🟦🟡🟦🟡🟦🟥<br>
🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
</p>
<h1 align="center">
<a href="https://sutom.nocle.fr/">Sutom</a> Solver</h1>

<p align="center">
  <img src="https://img.shields.io/github/v/tag/Astropilot/Sutom_Solver">
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-yellow.svg">
</p>

<p align="center">
    <a href="#"><img src="https://imgur.com/3C4iKO0.png" width="64" height="64"></a>
    <a href="#"><img src="https://imgur.com/ihXsdDO.png" width="64" height="64"></a>
    <a href="#edge"><img src="https://imgur.com/vMcaXaw.png" width="64" height="64"></a>
    <a href="#"><img src="https://imgur.com/EuDp4vP.png" width="64" height="64"></a>
    <a href="#"><img src="https://imgur.com/z8yjLZ2.png" width="64" height="64"></a>
    <a href="#"><img src="https://imgur.com/MQYBSrD.png" width="64" height="64"></a>
</p>

## A propos

> ⚠️ **Pas encore de version disponible**: Les liens au dessus ne fonctionnent pas encore, patientez quelques jours

Cette petite extension pour navigateur permet de résoudre automatiquement le jeu du [Sutom](https://sutom.nocle.fr/). L'algorithme va tenter de deviner le mot à partir d'un dictionnaire de mots français et des indices donnés par le jeu (lettres mal placées, bien placées ou non présentes dans le mot).

Ce projet n'a pas de grande vocation, l'idée m'est venu en jouant au Sutom et en essayant de comprendre les types d'information que l'on pouvait aller chercher à partir des indices donnés.<br>
Je me suis dis que ça pourrait être challengant de programmer à partir des indices des règles permettant de filtrer sur une liste de mots et voir comment le programme s'en sort. Et pour l'instant il se débrouille bien ;)

Pour l'utiliser rien de plus simple, installer l'extension, allez sur la page du Sutom et vous verrez apparaitre après 2-3sec un bouton "Résoudre" en dessous du clavier. Appuyez simplement dessus et laissez la magie de l'algorithmie opérée !<br>
**Note**: Si le bouton n'apparait pas c'est très probablement parce que vous avez déjà gagné/perdu ou que vous avez commencé la partie. Mon programme attends une partie non démarrée pour fonctionner.

## Build/Run

### Prérequis

* [Node.js](https://nodejs.org) v14+ et [npm.js](https://www.npmjs.com) v6+
* Un navigateur comme [Firefox](https://www.mozilla.org/fr/firefox/new), [Chrome](https://www.google.fr/chrome) ou [Edge](https://www.microsoft.com/edge)

Pour compiler l'extension
```sh
$ cd src/
$ npm install
$ npm run build
```

Un dossier `distribution/` est maintenant créé contenant tous les fichiers pour l'extension web. <br>
Il vous suffit maintenant de charger l'application dans votre navigateur web.

Vous pouvez utilisez les commandes suivantes pour ouvrir une instance de Firefox ou Chrome sur un profil séparé avec directement l'extension chargée et avec le site sutom.nocle.fr ouvert au démarrage:
```sh
# Pour lancer une instance de Chrome
$ npm run start

# Pour lancer une instance de Firefox
$ npm run start:firefox
```

Sinon vous pouvez charger manuellement l'extension avec les instructions suivantes:

* Firefox
    * Tapez `about:debugging` dans votre barre d'adresse
    * Allez dans l'onglet à gauche `Ce Firefox`
    * Dans la rubrique `Extensions temporaires` cliquez sur `Charger un module complémentaire temporaire...` et naviguez dans le dossier `distribution/` et choisissez le fichier `manifest.json` puis `Ouvrir`
    * L'extension est maintenant chargée et utilisable

* Chrome / Edge
    * Rendez-vous sur l'adresse `chrome://extensions/` pour Chrome ou `edge://extensions/` pour Edge
    * Activer le `Mode développeur`
    * Cliquez sur `Charger l'extension non empaquetée` / `Charger l'élément décompressé` puis naviguez jusque dans le dossier `distribution/` et faites OK
    * L'extension est maintenant chargée et utilisable

Pour mettre à jour automatiquement l'extension quand vous modifiez un fichier, utilisez la commande
```sh
$ npm run watch
```

## Licence

[MIT - Fichier LICENSE](https://github.com/Astropilot/Sutom_Solver/blob/master/LICENSE)

---

> [Yohann Martin (@Astropilot)](https://codexus.fr) &nbsp;&middot;&nbsp;
> 2022
