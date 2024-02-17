import httpServer from "./src/http_server/index";
import "./src/ws_server/wsServer";
import "dotenv/config";

const severPort = process.env.PORT || 8181;

console.log(`Start static http server on the ${severPort} port!`);
httpServer.listen(severPort);
