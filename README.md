# Websocket battleship server (Node.js & TS) ![Node.js](https://img.shields.io/badge/-Node.js-green) ![TypeScript](https://img.shields.io/badge/-TypeScript-blue)

**You should be in [develop branch](https://github.com/wellder00/Websocket_battleship_server/tree/develop).**

## 📦 How to install battleship server

You can clone this repository:

```bash
$ git clone git@github.com:wellder00/Websocket_battleship_server.git
```

Or download it by clicking the green "Code" button and then "Download ZIP". Open it in your IDE.

After that, enter in your console:

```bash
npm install
```

## ▶️ How to run

**Server port for listening incoming requests can be configured as an environment variable (.env.example is provided)**

Run the battleship server in development mode:

```bash
npm run start:dev
```

Run the battleship server in production mode:

```bash
npm run start
```

## 🌐 Works with Rest API

In this project, the server-side part of the well-known game Battleship is implemented. To play the game, you need to start one of the aforementioned commands and wait for notification of successful start of two REST API servers on port 8181 and a WebSocket on port 3000. Then, open a browser and go to [http://localhost:8181/](http://localhost:8181/). Next, register and choose one of two modes: either play with a bot or multiplayer. If you choose to play with a bot, place your ships or use the "Automatically" button, and then start the game. If you choose the multiplayer mode, you need to create a room and wait for another player to join the room. After that, place your ships and start the game.


[Link to this task here](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/assignment.md).
