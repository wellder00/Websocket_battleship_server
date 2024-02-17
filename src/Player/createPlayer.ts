import { users } from "../db/player";
import { createJsonMessage } from "../utils/utils";

export const createPlayer = (name: string, password: string, ws: WebSocket) => {
  if (users.has(name)) {
    const user = users.get(name);
    if (user.password === password) {
      return createJsonMessage("reg", { name, index: user.index, error: false });
    } else {
      return createJsonMessage("reg", { error: true, errorText: "Error password" });
    }
  } else {
    const index = users.size + 1;
    users.set(name, { password, index, ws });
    console.log(users);
    return createJsonMessage("reg", { name, index, error: false, errorText: "" });
  }
};
