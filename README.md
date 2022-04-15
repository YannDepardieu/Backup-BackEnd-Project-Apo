# Starry Night - Back-End

## API that provide json for A single page application to get a glimpse to constellations reachable at your location

Enter a postal adress and get to see what's on the sky over that spot. See the constellation trace, and know a little more about its story and myth.

## To install

`npm install` to get all dependencies.

Attention de bien installer la version 2 de node-fetch car la dernière version nécessite la syntaxe "import" qui ne sera pas compatible avec le reste de l'app.

```s
npm node-fetch@2
```

`npm start` to run the API server

Get to [Starry Nights UI Swagger docs](http://localhost:3001/api-docs/) to see all the routes availables and their reponses, or check how to...

## Fetch Data for Starry Nights Web

### Non authorised user

| Section | Function             | Tag             | Verb | Route                      | Description                                                |
| ------- | -------------------- | --------------- | ---- | -------------------------- | ---------------------------------------------------------- |
| page    | home                 | Myth            | get  | /myth/random               | A random myth and its constellation                        |
| page    | home                 | Constellation   | get  | /constellation/getAllNames | All constellations names for the search bar                |
| header  | menu Constellations  | Entities routes | get  | /common/constellations     | All constellations with full details                       |
| modale  | Constellation        | Constellation   | get  | /constellation/:id         | A single constellation with full details and myth (if any) |
| header  | menu Myths           | Entities routes | get  | /common/myth               | All myths with full details                                |
| modale  | Myth                 | Entities routes | get  | /common/myth/:id           | A single myth with full details and related celestial body |
| page    | User inscription     | Entities routes | post | /common/user               | Create a new user                                          |
| header  | menu User connection | User            | post | /user/auth                 | Checks email and password to allow connection              |

### Authorized user

| Section | Function                   | Tag             | Verb   | Route                              | Description                                                |
| ------- | -------------------------- | --------------- | ------ | ---------------------------------- | ---------------------------------------------------------- |
| header  | menu User déconnection     | User            | get    | /user/logout                       | Manages the user logout flow                               |
| header  | menu User profile          | User            | get    | /user                              | Gets all user's details                                    |
| page    | Modify user profile        |                 |        |                                    | Updates user's details                                     |
| modale  | Set a Constellation as fav | Constellation   | post   | /constellation/fav                 | Adds one constellation as a user's favorite                |
| header  | menu My Constellations     | Constellation   | get    | /constellation/fav                 | Get all user's constellations                              |
| modale  | see one Constellation      | Constellation   | get    | /constellation/:id                 | A single constellation with full details and myth (if any) |
| modale  | delete one Constellation   | Entities routes | delete | /common/favorite_constellation/:id | Deletes one user's favorite constellation                  |
| header  | menu My Places             | Place           | get    | /place                             | Get all user's places                                      |
| page    | home Create one Place      | Place           | post   | /place                             | Creates one user's place                                   |
| page    | home Check one Place       | Place           | get    | /place:id                          | Get on the map one user's place                            |
| modale  | Updates one Place          | Entities routes | patch  | /place/:id                         | Updates one user's place                                   |
| modale  | Deletes one Place          | Place           | delete | /place/:id                         | Deletes one user's place                                   |
| header  | menu My Events             |                 |        |                                    | Get all user's events                                      |
| page    | home Create one Event      |                 |        |                                    | Creates one user's event                                   |
| modale  | Updates one Event          |                 |        |                                    | Updates one user's event                                   |
| modale  | Deletes one Event          |                 |        |                                    | Deletes one user's event                                   |
| page    | home button Chercher       | geocoding       | get    | /geocoding/forward                 | Retrieves an adrdess to return latitude and longitude      |
| page    | Get password link email    |                 |        |                                    | Checks user's email to send a link email                   |
| page    | Post code to modify pass   |                 |        |                                    | Checks code entered by user                                |
| page    | Modifies password          |                 |        |                                    | Post new password                                          |
