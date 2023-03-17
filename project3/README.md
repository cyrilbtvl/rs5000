# Voting Contract

Il s'agit d'un contrat intelligent implémenté en langage Solidity qui gère un système de vote.\
Le contrat permet au propriétaire de gérer l'inscription des électeurs, les soumissions de propositions et les sessions de vote.\
Il se termine par le décompte des votes

## Quelques liens
- Une vidéo de présentation du projet avec image et son et sur l'URL suivant : https://www.loom.com/share/f13d49a0a236467385699b14b169fcd5
- Une vidéo du projet plus net sans image et son sur l'URL suivant : https://www.loom.com/share/6ae31058c16d40b99f23ab2ea3029618
- Le lien vers un déploiement public de la DApp sur Vercel : https://rs5000-cyrilbtvl.vercel.app

## Processus de vote

- L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
- L'administrateur du vote commence la session d'enregistrement de la proposition.
- Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
- L'administrateur de vote met fin à la session d'enregistrement des propositions.
- L'administrateur du vote commence la session de vote.
- Les électeurs inscrits peuvent voir toutes les propositions qui sont soumises aux votes
- Les électeurs inscrits votent pour leur proposition préférée.
- L'administrateur du vote met fin à la session de vote.
- L'administrateur du vote comptabilise les votes.
- Tout le monde peut vérifier les derniers détails de la proposition gagnante.

## Les recommandations et exigences

- L’administrateur est celui qui va déployer le smart contract.
- Le vote n'est pas secret pour les utilisateurs ajoutés à la Whitelist
- Le gagnant est déterminé à la majorité simple
- La proposition qui obtient le plus de voix l'emporte.

## Prérequis

- Node.js installé
- Truffle installé
- Ganache installé
- web3 installé
- truffle unbox react installé

## Installation

Les instructions suivantes vous permettrons d'installer le projet pour lancer les tests :
- Clonez le projet, entrez la ligne de commande suivante : 
```bash
npm clone https://github.com/cyrilbtvl/rs5000.git
```
- Mettez vous dans le dossier /projet2

## Démarrage
- Lancez votre blockchain privée avec la commande : 
```bash
ganache
```
- Lancez deployer le contrat avec la commande : 
```bash
truffle migrate --network 'votre network'
```

- Lancez le front avec la commande : 
```bash
npm run start
```

## Contributeurs

[Cyril Boutteville](https://github.com/cyrilbtvl/rs5000)

## License

[MIT](https://choosealicense.com/licenses/mit/)
