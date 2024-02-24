import httpServer from "./src/http_server/index";
import { consoleColors } from "./src/utils/constants/const";
import "./src/ws_server/wsServer";
import "dotenv/config";

const severPort = process.env.PORT || 8181;

console.log(consoleColors.green, `Start static http server on the ${severPort} port!`);
httpServer.listen(severPort);
