# Redis Plan

- Il faut un cache fixe propre à la partie non connectée
- Il faut que le cache soit propre à chaque utilisateur
- Il faut que le cache soit propre à chaque router/entité

SI je rajoute un event alors je flush le cache mais uniquement en rapport avec l'utilisateur et la table event