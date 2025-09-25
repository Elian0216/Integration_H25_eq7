## 📈 MÈCHEPRO : Application d'Analyse Boursière

**Lien Vidéo de Démonstration :** https://www.youtube.com/watch?v=OxFH2sXxAlI

MÈCHEPRO est une application web conçue pour **automatiser le processus d'analyse technique boursière** et mettre en évidence des motifs et tendances sur les graphiques d'actions. Elle sert à la fois d'outil d'apprentissage pour les analystes débutants et d'outil de vérification et de comparaison pour les professionnels.

---

## 🎯 Objectif du Projet

Notre objectif est d'offrir au grand public la possibilité de **prendre en main leurs finances** sans avoir à dépenser des sommes importantes pour des coachs financiers ou des applications coûteuses. MÈCHEPRO vise à aider les utilisateurs à mieux comprendre les aspects théoriques de l'analyse technique.

---

## ✨ Fonctionnalités Clés

L'application propose les fonctionnalités suivantes pour les utilisateurs et les administrateurs :

| Acteur | Scénario | Description |
| :--- | :--- | :--- |
| **Utilisateur** | **Connexion/Inscription** | Un utilisateur est libre de se créer un compte. |
| | **Recherche/Analyse** | Une analyse visuelle peut être faite en avant-plan sur le graphique pour voir les tendances et leurs explications. |
| | **Gérer page de sauvegarde (Favoris)** | Un utilisateur peut ajouter ou enlever des graphiques d'analyse à sa page. |
| **Administrateur** | **Gestion de compte** | Consultation, création ou suppression d’utilisateur, modification de propriété de compte (par exemple, nom d’utilisateur, etc.). |

---

## 💻 Technologies Utilisées

Ce projet repose sur une pile de technologies modernes pour le développement web, l'analyse de données et le déploiement :

### Backend et Analyse
* **Langage :** **Python** (utilisé pour l'intégralité du *backend* et pour avoir accès au vaste réseau de librairies).
* **Framework Web :** **Django** (pour faciliter la programmation du site web).
* **Base de Données :** **MongoDB** (hébergée sur la plateforme MongoDB).
* **Adaptateur DB :** **djongo** (pour assurer la connexion entre Django et MongoDB).
* **API de Données :** **yfinance** (pour la collecte des données financières à partir de Yahoo Finance).
* **Librairies d'Analyse :**
    * **Plotly** (utilisé pour montrer les graphes d’actions et leurs analyses).
    * **scikit-learn** (pour calculer les K-Moyennes).

### Frontend et Infrastructure
* **Interface Web :** **NextJS** en **React**.
* **Styles :** **Tailwind** (framework CSS).
* **Proxy Inverse :** **Nginx** (utilisé pour regrouper le *frontend* et le *backend* sur le même domaine, facilitant la résolution des problèmes de CORS et de *cross-cookies*).
* **Collaboration :** **GitHub** (utilisé pour partager le code entre les membres de l’équipe).

---

## 🛠️ Indicateurs et Concepts Mathématiques

L'analyse technique de MÈCHEPRO intègre plusieurs concepts mathématiques et indicateurs boursiers :

| Indicateur | Description | Utilité |
| :--- | :--- | :--- |
| **Moyenne Mobile** | Moyenne du prix de fermeture des *n* bougies précédentes. | Montre la **tendance générale** du marché, permet d'obtenir des niveaux de support et résistance dynamiques. |
| **Relative Strength Index (RSI)** | Oscillateur de 0 à 100, calculé avec des fractions basées sur le nombre de bougies haussières et baissières. | Identifie des moments où l'action est **surévaluée (>70)** ou **sous-évaluée (<30)** et permet de trouver des **divergences**. |
| **Méthode des Fractales (Bill Williams)** | Identifie les sommets (un fractal haussier ou baissier est un pattern de 5 bougies). | Ces sommets sont les points les plus utiles pour identifier les niveaux de **support et résistance** où le prix se retourne. |
| **Regroupement des prix (K-moyennes)** | Méthode algorithmique pour séparer les points (ex. fractales) en groupes et les représenter par un point moyen. | Permet d'obtenir les niveaux où le prix stagne pour identifier les niveaux de **support et résistance**. |

> **Note :** Le code backend pour le **Moving Average Convergence Divergence (MACD)** a été créé, mais l'indicateur n'a pas été ajouté sur la page du graphique pour ne pas la surcharger.

---

## ⚙️ Architecture du Déploiement

Le déploiement est structuré selon le diagramme de déploiement suivant :

1.  **PC (Utilisateur) :** Interagit avec la Page Web.
2.  **Page Web (React-NextJS) :** Interface utilisateur.
3.  **Serveur Web (Django) :** Gère la logique métier et communique avec l'API yfinance et la Base de données.
4.  **Api yfinance :** Source des données financières.
5.  **Base de données (MongoDB) :** Stockage des données.

---

## 🚀 Perspectives d'Amélioration (Innovation)

Si plus de temps avait été disponible, les améliorations prévues incluraient:

* **Page d'action plus complexe :** Le site contiendrait une page beaucoup plus complexe à propos de chaque action, avec d'autres indicateurs et informations connexes.
* **Système de suivi d'investissement :** Un utilisateur aurait pu inscrire les dates où il a acheté ses actions dans le but de suivre ses gains et ses pertes.
* **Barre de recherche dynamique (Indexation) :** Une barre de recherche dynamique, proposant les recherches possibles en dessous de la barre pendant que l’utilisateur tape.

---

## ⚠️ Avertissement et Conclusion

Il est crucial de se rappeler que l'analyse technique n'est **pas toujours fiable** et ne garantit pas de résultats précis. Ce site est un **outil d'apprentissage à but principalement théorique**. Pour l'argent et l'investissement, il faut toujours faire preuve de prudence, bien se renseigner et éviter de prendre des décisions trop hâtives. Notre plateforme vise à aider les utilisateurs à mieux comprendre les aspects théoriques de l’analyse technique et du marché, afin de les aider à faire des choix plus éclairés.

---

*Projet réalisé par **Andy Thai**, **Elian Bettan**, **Valère Bardon** et **Georges Abi Chahine**.*
