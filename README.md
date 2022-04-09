# Starry Night - Back-End

## API that provide json for A single page application to get a glimpse to constellations reachable at your location

Enter a postal adress and get to see what's on the sky over that spot. See the constellation trace, and know a little more about its story and myth.

## To install

```npm install``` to get all dependencies.

```npm start``` to run the API server

Get to [Starry Nights UI Swagger docs](http://localhost:3001/api-docs/) to see all the routes availables and their reponses, or check how to...

## Fetch Data for Starry Nights Web

### Non authorised user

| Section | Function             | Tag             | Verb | Route                      | Description                                                |
|---------|----------------------|-----------------|------|----------------------------|------------------------------------------------------------|
| page    | home                 | Myth            | get  | /myth/random               | A random myth and its constellation                        |
| page    | home                 | Constellation   | get  | /constellation/getAllNames | All constellations names for the search bar                |
| header  | menu Constellations  | Entities routes | get  | /common/constellations     | All constellations with full details                       |
| modale  | Constellation        | Constellation   | get  | /constellation/:id         | A single constellation with full details and myth (if any) |
| header  | menu Myths           | Entities routes | get  | /common/myth               | All myths with full details                                |
| modale  | Myth                 | Entities routes | get  | /common/myth/:id           | A single myth with full details and related celestial body |
| page    | User inscription     | Entities routes | post | /common/user               | Create a new user                                          |
| header  | menu User connection | User            | post | /user/auth                 | Checks password to allow connection                        |

### Authorized user