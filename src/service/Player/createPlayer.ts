import { users } from "../../db/player";
import { createJsonMessage } from "../../utils/utils";

export const createPlayer = (name: string, password: string, ws: WebSocket) => {
  if (users.has(name)) {
    const user = users.get(name);
    if (user.data.password === password) {
      return { name, index: user.data.index, error: false };
    } else {
      return { error: true, errorText: "Error password" };
    }
  } else {
    const index = users.size + 1;
    users.set(name, {
      type: "reg",
      data: {
        name,
        password,
        index,
        error: false,
        errorText: "",
      },
      id: 0,
      ws,
    });
    return { name, index, error: false, errorText: "" };
  }
};
