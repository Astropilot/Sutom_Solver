<p align="center">
π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯<br>
π₯π¦π‘π‘π‘π¦π‘π¦π‘π¦π‘π‘π‘π¦π‘π‘π‘π¦π‘π¦π‘π¦π₯<br>
π₯π¦π‘π¦π¦π¦π‘π¦π‘π¦π¦π‘π¦π¦π‘π¦π‘π¦π‘π‘π‘π¦π₯<br>
π₯π¦π‘π‘π‘π¦π‘π¦π‘π¦π¦π‘π¦π¦π‘π¦π‘π¦π‘π¦π‘π¦π₯<br>
π₯π¦π¦π¦π‘π¦π‘π¦π‘π¦π¦π‘π¦π¦π‘π¦π‘π¦π‘π¦π‘π¦π₯<br>
π₯π¦π‘π‘π‘π¦π‘π‘π‘π¦π¦π‘π¦π¦π‘π‘π‘π¦π‘π¦π‘π¦π₯<br>
π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯π₯
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

> β οΈ **Pas encore de version disponible**: Les liens au dessus ne fonctionnent pas encore, patientez quelques jours

Cette petite extension pour navigateur permet de rΓ©soudre automatiquement le jeu du [Sutom](https://sutom.nocle.fr/). L'algorithme va tenter de deviner le mot Γ  partir d'un dictionnaire de mots franΓ§ais et des indices donnΓ©s par le jeu (lettres mal placΓ©es, bien placΓ©es ou non prΓ©sentes dans le mot).

Ce projet n'a pas de grande vocation, l'idΓ©e m'est venu en jouant au Sutom et en essayant de comprendre les types d'information que l'on pouvait aller chercher Γ  partir des indices donnΓ©s.<br>
Je me suis dis que Γ§a pourrait Γͺtre challengant de programmer Γ  partir des indices des rΓ¨gles permettant de filtrer sur une liste de mots et voir comment le programme s'en sort. Et pour l'instant il se dΓ©brouille bien ;)

Pour l'utiliser rien de plus simple, installer l'extension, allez sur la page du Sutom et vous verrez apparaitre aprΓ¨s 2-3sec un bouton "RΓ©soudre" en dessous du clavier. Appuyez simplement dessus et laissez la magie de l'algorithmie opΓ©rΓ©e !<br>
**Note**: Si le bouton n'apparait pas c'est trΓ¨s probablement parce que vous avez dΓ©jΓ  gagnΓ©/perdu ou que vous avez commencΓ© la partie. Mon programme attends une partie non dΓ©marrΓ©e pour fonctionner.

## Build/Run

### PrΓ©requis

* [Node.js](https://nodejs.org) v14+ et [npm.js](https://www.npmjs.com) v6+
* Un navigateur comme [Firefox](https://www.mozilla.org/fr/firefox/new), [Chrome](https://www.google.fr/chrome) ou [Edge](https://www.microsoft.com/edge)

Pour compiler l'extension
```sh
$ cd src/
$ npm install
$ npm run build
```

Un dossier `distribution/` est maintenant crΓ©Γ© contenant tous les fichiers pour l'extension web. <br>
Il vous suffit maintenant de charger l'application dans votre navigateur web.

Vous pouvez utilisez les commandes suivantes pour ouvrir une instance de Firefox ou Chrome sur un profil sΓ©parΓ© avec directement l'extension chargΓ©e et avec le site sutom.nocle.fr ouvert au dΓ©marrage:
```sh
# Pour lancer une instance de Chrome
$ npm run start

# Pour lancer une instance de Firefox
$ npm run start:firefox
```

Sinon vous pouvez charger manuellement l'extension avec les instructions suivantes:

* Firefox
    * Tapez `about:debugging` dans votre barre d'adresse
    * Allez dans l'onglet Γ  gauche `Ce Firefox`
    * Dans la rubrique `Extensions temporaires` cliquez sur `Charger un module complΓ©mentaire temporaire...` et naviguez dans le dossier `distribution/` et choisissez le fichier `manifest.json` puis `Ouvrir`
    * L'extension est maintenant chargΓ©e et utilisable

* Chrome / Edge
    * Rendez-vous sur l'adresse `chrome://extensions/` pour Chrome ou `edge://extensions/` pour Edge
    * Activer le `Mode dΓ©veloppeur`
    * Cliquez sur `Charger l'extension non empaquetΓ©e` / `Charger l'Γ©lΓ©ment dΓ©compressΓ©` puis naviguez jusque dans le dossier `distribution/` et faites OK
    * L'extension est maintenant chargΓ©e et utilisable

Pour mettre Γ  jour automatiquement l'extension quand vous modifiez un fichier, utilisez la commande
```sh
$ npm run watch
```

## Licence

[MIT - Fichier LICENSE](https://github.com/Astropilot/Sutom_Solver/blob/master/LICENSE)

---

> [Yohann Martin (@Astropilot)](https://codexus.fr) &nbsp;&middot;&nbsp;
> 2022
