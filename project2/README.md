# Voting Contract

Il s'agit d'un contrat intelligent implémenté en langage Solidity qui gère un système de vote.\
Le contrat permet au propriétaire de gérer l'inscription des électeurs, les soumissions de propositions et les sessions de vote.\
Il se termine par le décompte des votes

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
- Chaque électeur peut voir les votes des autres
- Le gagnant est déterminé à la majorité simple
- La proposition qui obtient le plus de voix l'emporte.

## Prérequis

- Node.js installé
- Truffle installé
- Ganache installé

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
- Lancez vos tests avec la commande : 
```bash
truffle test
```
## Résultat des test

```code
Contract: Voting contract tests suite
    Contract ownership
      ✔ Ownership has been transferred

    As the owner, I should be able to add voters
      ✔ A voter can be registered (71ms)
      ✔ Should return an error when voter wants add voters (165ms)
      ✔ An address could not be registered more than once

    As the owner, I should be able to start proposals registering
      ✔ owner start proposals registering (71ms)
      ✔ Should return an error when voter wants start proposals registering

    As the voter, I should be able to add proposal
      ✔ the voter add a proposal (68ms)
      ✔ Should return an error when owner wants add proposal
      ✔ Should return an error when voter wants add empty proposal

    As the owner, I should be able to stop proposals registering
      ✔ owner stop proposals registering (44ms)
      ✔ Should return an error when voter wants stop proposals registering

    As the owner, I should be able to start voting session
      ✔ owner start voting session (45ms)
      ✔ Should return an error when voter wants start Voting Session

    As the voter, I should be able to add a vote
      ✔ the voter add a vote (93ms)
      ✔ Should return an error when onwer wants vote
      ✔ Should return an error when voter has already voted
      ✔ Should return an error when onwer vote and proposal not found

    As the owner, I should be able to stop voting session
      ✔ owner stop voting session (43ms)
      ✔ Should return an error when voter wants stop Voting Session

    As the owner, I should be able to tally votes
      ✔ owner tally votes (62ms)
      ✔ Should return an error when voter wants tally Votes

    As the voter, I should be able to get another voter
      ✔ Should return an error when user is not a voter

    As the voter, I should be able to get a proposal
      ✔ Should return an error when user is not a voter

    Error if bad status
      ✔ Should return an error when owner add a voter
      ✔ Should return an error when voter wants add proposal
      ✔ Should return an error when voter wants set a vote
      ✔ Should return an error when owner start Proposals Registering
      ✔ Should return an error when owner end Proposals Registering
      ✔ Should return an error when owner start Voting Session
      ✔ Should return an error when owner end Voting Session

    Error when owner tally Votes and bad status
      ✔ Should return an error when owner tally Votes

  31 passing (567ms)
```

## Couverture de code

```
-------------|----------|----------|----------|----------|----------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------|----------|----------|----------|----------|----------------|
 contracts/  |      100 |      100 |      100 |      100 |                |
  Voting.sol |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
All files    |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
```

## Contributeurs

[Cyril Boutteville](https://github.com/cyrilbtvl)

## License

[MIT](https://choosealicense.com/licenses/mit/)