# Rapport itération 1 - équipe 3

## LOG210-année-session-groupe (ex. LOG210-2020-été-g01)

### Coéquipiers

- Bédard, Tommy, AQ13400
- Abdelli, Pierre Amar, AQ48850
- Bewa, Lionel, AQ22600
- El-Safady, Sobhi, AP94320
- Korchi, Zakaria , AQ25210

### Chargés de laboratoire

- Valère K. Fami

# Grille de correction

<details><summary>Cliquez ici pour lire les consignes obligatoires</summary>
<p>

- Tous vos diagrammes doivent être faits avec <https://plantuml.com/fr/>
- Les diagrammes doivent être visibles dans ce rapport
- Supprimer les textes explicatifs du gabarit (sauf ces consignes-ci)
- Vous devez exporter ce fichier en format PDF et l'ajouter dans votre dépôt
</p>
</details>

> ⚠️ **Un travail qui contient trop d’erreurs fréquentes peut être refusé par le chargé de laboratoire. L'équipe peut reprendre le travail avec une pénalité de 25%. Vérifiez attentivement la grille de correction et les notes de cours**

Le travail sera noté selon la [grille de correction des rapports](https://docs.google.com/spreadsheets/d/1KKGPxac13vHttuC2AQDpRrgLuirMU0kd3qFxc9qhOuk). Pour y accéder, vous devez utiliser votre adresse `etsmtl.net`.

# Introduction

> Dans cette première itération, l'objectif était de concevoir la structure générale du Système de gestion des apprentisages. L'évaluation du modèle du domaine, établir les diagrames de séquences systèmes reliés au cas d'utilisation ainsi que leur diagramme de cas d'utilisation. Finalement, l'utilisation des analyse conceptuelles développer dans la première partie pour réaliser l'implémentation des cas d'utilisations CU01 et CU02. 

# Modèle du domaine

> Le MDD est cumulatif : vous devez y ajouter des éléments à chaque itération (ou corriger les erreurs), selon la portée (et votre meilleure compréhension du problème) visée par votre solution. Utilisez une légende dans le MDD pour indiquer la couleur de chaque itération afin de faire ressortir les changements. Voir les stéréotypes personnalisés : <https://plantuml.com/fr/class-diagram> et [comment faire une légende avec couleurs en PlantUML](https://stackoverflow.com/questions/30999290/how-to-generate-a-legend-with-colors-in-plantuml).

> ![MDD](../../out/docs/modeles/mdd/MDD.svg)

## CU01a - Ajouter cours
**Acteur principal:**  Enseignant

**Préconditions:** 
- L’enseignant est authentifié. SGA transfère l'information à SGB pour l'authentification. SGB retourne un token que SGA retourne à l'usager. L'usager doit nécessairement utiliser ce token pour faire ses requêtes à SGA..

**Garanties en cas de succès (postconditions):**  
- Un nouveau cours est créé.
- L’enseignant est associé au cours
- Les étudiants inscrits dans le groupe-cours(SGB) sont associés au cours

**Scénario principal (succès):** 
1. L’enseignant demande de créer un nouveau cours.
1. Le système affiche la liste des groupes-cours qu’enseigne l’enseignant (l’information provient du SGB).
1. L’enseignant choisit un groupe-cours dans la liste.
1. Le système affiche l’information du cours et affiche la liste des étudiants inscrits dans le groupe-cours correspondant (l’information provient du SGB).

**Extensions (ou scénarios alternatifs):** 

&nbsp;&nbsp;&nbsp;3a. Un cours correspondant au groupe-cours sélectionné existe déjà.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Le système signale l'erreur et rejette la saisie.


## DSS CU01a - Ajouter cours

![DSS_ajouter_cours](../../out/docs/Ajouter%20cours/DSS_Ajouter_Cours/DSS_Ajouter_Cours_Succes.svg)

### `recupererCoursSgb(token : String)`

> Si une opération a déjà été documentée dans un autre DSS, ajoutez un hyperlien vers le contrat précédent.

**Contrat d'opération**

_PostCondition_

  - aucun

**RDCU**

![RDCU_recupererCoursSgb](../../out/docs/Ajouter%20cours/RDCU_recupererCoursSgb/recupererCoursSgb.svg)

### `ajouterCours(tokenEnseignant : String, idCours : String, numeroGroupe : String)`

**Contrat d'opération**

_PostCondition_

- Un nouveau cours est créé s'il n'existe pas déjà
- Un nouveau GroupeCours est créé
- le GroupeCours est associé au Cours
- L’enseignant est associé au cours
- Les étudiants inscrits dans le groupe-cours(SGB) sont associés au cours

**RDCU**

![RDCU_ajouterCours](../../out/docs/Ajouter%20cours/RDCU_ajouterCours/creerNouveauCours.svg)

## CU01b - Récupérer cours
**Acteur principal:**  Enseignant

**Préconditions:** 
- L’enseignant est authentifié.

**Garanties en cas de succès (postconditions):**  
- Aucun

**Scénario principal (succès):** 
1. L’enseignant demande la liste de ses cours.
1. Le système affiche la liste de ses cours.
1. L’enseignant demande les détails d’un cours.
1. Le système affiche l’information du cours et affiche la liste des étudiants inscrits.

## DSS CU01b - Récupérer cours

![DSS_recupererCours](../../out/docs/Récupérer%20cours/DSS_Récupérer_cours/DSS%20Récupérer%20cours.svg)

### `recupererTousCoursSga(token : String)` 

**Contrat d'opération**

_PostCondition_

- Aucun

**RDCU**

![RDCU_RecupererTousCoursSga](../../out/docs/Récupérer%20cours/RDCU_Recuperer_Cours/récupérer%20tous%20les%20cours%20créés.svg)

### `recupererUnCoursSga(token : String, idCours : String)` ###

**Contrat d'opération**

_PostCondition_

- Aucun

**RDCU**

![RDCU_RecupererUnCoursSga](../../out/docs/Récupérer%20cours/RDCU_Recuperer_Cours/récupérer%20un%20cours.svg)

## CU01c - Retirer cours
**Acteur principal:**  Enseignant

**Préconditions:** 
- L’enseignant est authentifié.

**Garanties en cas de succès (postconditions):**  
- Le cours n’existe plus dans le système SGA

**Scénario principal (succès):** 
1. L’enseignant demande la liste de ses cours.
1. Le système affiche la liste de ses cours.
1. L’enseignant demande les détails d’un cours.
1. Le système affiche l’information du cours et affiche la liste des étudiants inscrits.
1. L’enseignant demande de supprimer le cours.
1. Le système demande une confirmation pour supprimer le cours.
1. L’enseignant confirme.
1. Le système supprime le cours et affiche la nouvelle liste de cours.
   
## DSS CU01c - Retirer cours
![Dss_retirer_Cours](../../out/docs/Retirer%20cours/DSS_Retirer_Cours/DSS_Retirer_Cours.svg)

### `recupererTousCoursSga(token : String)`
[recupererTousCoursSga](#recuperertouscourssgatoken--string)

### `recupererUnCoursSga(token : String, idCours : String)`
[recupererUnCoursSga](#recupereruncourssgatoken--string-idcours--string)

### `retirerCours(token : String, idCours : String)`

**Contrat d'opération**

_PostCondition_

- Aucun

**RDCU**

![supprimerUneQuestionSga](../../out/docs/Retirer%20cours/RDCU_Supprimer_Cours/supprimerUneQuestionSga.svg)

### `confirmerSuppression(sigleCours : String, idGroupeCours : int)`

**Contrat d'opération**

_PostCondition_

- Le cours n’existe plus dans operationQuestion

**RDCU**

![confirmerSuppression](../../out/docs/Retirer%20cours/RDCU_Supprimer_Cours/confirmerSuppression.svg)

## CU02a - Ajouter question
**Acteur principal:**  Enseignant

**Préconditions:** 
- L’enseignant est authentifié.

**Garanties en cas de succès (postconditions):**  
- Une nouvelle question a été créée dans la banque pour le cours.

**Scénario principal (succès):** 
1. L’enseignant commence la création de questions
1. Le système affiche les cours actifs de l’enseignant
1. L’enseignant sélectionne un cours
1. Le système affiche toutes les questions associées au cours.
1. L’enseignant ajoute une question de type vrai-faux en spécifiant une ou plusieurs catégories non hiérarchiques (“tags”), un nom (court) de la question, l’énoncé (le texte) de la question, la vérité (vrai ou faux) de l’énoncé, un texte de rétroaction pour la bonne réponse et un texte de rétroaction pour la mauvaise réponse.
1. L’enseignant répète l’étape 5 jusqu’à ce qu’il n’ait plus de questions à ajouter au cours.

**Extensions (ou scénarios alternatifs):** 

&nbsp;&nbsp;&nbsp;5a. L’enseignant ajoute un autre type de question (défini par S4)

&nbsp;&nbsp;&nbsp;5b. Le nom de la question n’est pas unique.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Le Système signale l'erreur et rejette la saisie.

## DSS CU02a - Ajouter question

![Dss_ajouterQuestion](../../out/docs/Ajouter%20question/DSS_Ajouter_Question/DSS_Ajouter_Question.svg)

### `recupererTousCoursSga(token : String)`
[recupererTousCoursSga](#recuperertouscourssgatoken--string)

### `recupererUnCoursSgaQuestion(token : String, idCours : String)`

**Contrat d'opération**

_PostCondition_

- aucune

**RDCU**

![recupererUnCoursSgaQuestion](../../out/docs/Ajouter%20question/RDCU_Ajouter_Question/recupererCoursSgaQuestion.svg)

### `ajouterQuestion(numeroGroupe : int, tags : String, nom : String, texteQuestion : String,reponse : boolean, texteBonneReponse : String, texteMauvaiseReponse : String)`

**Contrat d'opération**

_PostCondition_

- Une nouvelle question a été créée
- La nouvelle question a été associée à operationQuestion.
- La question a été associé a un GroupeCours

**RDCU**

![recupererUnCoursSgaQuestion](../../out/docs/Ajouter%20question/RDCU_Ajouter_Question/ajouterQuestionFinal.svg)

## CU02b - Récupérer question
**Acteur principal:**  Enseignant

**Préconditions:** 
- L’enseignant est authentifié.

**Garanties en cas de succès (postconditions):**  
- Aucun

**Scénario principal (succès):** 
1. L’enseignant commence la récupération de questions
1. Le système affiche toutes les questions de l’enseignant
1. L’enseignant sélectionne une question
1. Le système affiche les détails de la question
   
On répète les étapes 3 et 4 tant que l’enseignant n’a pas terminé

## DSS CU02b - Récupérer question

![DSS_RécupérerQuestion](../../out/docs/Récupérer%20question/DSS_Récupérer_Question/DSS_Recuperer_Question.svg)

### `recupererToutesQuestionsSga(token : String)`

**Contrat d'opération**

_PostCondition_

- aucune

**RDCU**

![recupererToutesQuestionsSga](../../out/docs/Récupérer%20question/RDCU_Recuperer_Question/recupererTouteQuestion.svg)

### `recupererUneQuestion(token : String, idQuestion : String)`

**Contrat d'opération**

_PostCondition_

- aucune

**RDCU**

![recupererUneQuestion](../../out/docs/Récupérer%20question/RDCU_Recuperer_Question/recupererUneQuestion.svg)

## CU02c - Modifier question
**Acteur principal:**  Enseignant

**Préconditions:** 
- L’enseignant est authentifié.

**Garanties en cas de succès (postconditions):**  
- La question a été modifiée dans la banque pour le cours.

**Scénario principal (succès):** 
1. L’enseignant commence la modification d’une question
1. Le système affiche les valeurs actuelles de la question à modifier.
1. L’enseignant effectue les modifications de la question et les sauvegarde.
1. Le système affiche la question modifiée.

**Extensions (ou scénarios alternatifs):** 

&nbsp;&nbsp;&nbsp;3a. Le nom (modifié) de la question n’est pas unique.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Le Système signale l'erreur et rejette la saisie.

## DSS CU02c - Modifier question

![DSS_ModifierQuestion](../../out/docs/Modifier%20question/DSS_Modifier_Question/DSS_Modifier_Question.svg)

### `recupererUneQuestion(token : String, idQuestion : String)`
[recupererUneQuestion](#recupererunequestiontoken--string-idquestion--string)

### `modifierQuestion(tags : String[], nom : String, texteQuestion : String, reponse : boolean,texteBonneReponse : String, texteMauvaiseReponse : String)`

**Contrat d'opération**

_PostCondition_

  - La question a été modifiée dans operationQuestion

**RDCU**

![recupererUneQuestion](../../out/docs/Modifier%20question/RDCU_Modifier_Question/modifierQuestionFinal.svg)

## CU02d - Supprimer question
**Acteur principal:**  Enseignant

**Préconditions:** 
- L’enseignant est authentifié.

**Garanties en cas de succès (postconditions):**  
- Une question a été supprimée de la banque pour le cours.

**Scénario principal (succès):** 
1. L’enseignant commence la suppression d’une question
1. Le système affiche les valeurs actuelles de la question à supprimer.
1. L’enseignant confirme la suppression de la question

**Extensions (ou scénarios alternatifs):**

&nbsp;&nbsp;&nbsp;2a. Le système affiche la liste des questionnaires utilisant cette question et désactive la possibilité de suppression tant que la question est utilisée dans un questionnaire.

## DSS CU02d - Modifier question

![DSS_Supprimerquestion](../../out/docs/Supprimer%20question/DSS_Supprimer_Question/DSS_Supprimer_Question.svg)

### `recupererUneQuestion(token : String, idQuestion : String)`
[recupererUneQuestion](#recupererunequestiontoken--string-idquestion--string)

### `supprimerUneQuestion(idQuestion : String)`

**Contrat d'opération**

_PostCondition_

- Une question a été supprimée dans operationQuestion

**RDCU**

![supprimerUneQuestion](../../out/docs/Supprimer%20question/RDCU_Supprimer_Question/supprimerUneQuestionFinal.svg)



