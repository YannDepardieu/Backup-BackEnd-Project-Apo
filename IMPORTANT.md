# Important

Attention de bien installer la version 2 de node-fetch car la dernière version nécessite la syntaxe "import" qui ne sera pas compatible avec le reste de l'app.

```s
npm node-fetch@2
```

## Créer et ajouter un event à un user

Le user va envoyer un json avec les spécificités de l'événement

    "name" text NOT NULL,


```json
{
    "name": "Samedi soir",
    "address": "Chemin pich Gaillard 65120 Saussa",
    "event_datetime": "2022-04-12 07:19:12+01",
    "recall_datetime": "2022-04-12 23:00:00+01",
}
```

avec l'adresse on va appeler l'API de geocoding pour récupérer les champs de latitude et longitude
que l'on va rajouter au json :

```json
{
    "name": "Samedi soir",
    "address": "Chemin pich Gaillard 65120 Saussa",
    "event_datetime": "",
    "recall_datetime": "",
    "latitude": 20,
    "longitude": 10
}
```

J'insère ça dans la table event, je récupère l'id de l'event et avec l'id de l'user contenu dans le token, je viens insérer
dans la table d'association