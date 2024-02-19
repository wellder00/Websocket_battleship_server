import { users } from "../../db/player";

export const createPlayer = (name: string, password: string, ws: WebSocket) => {
  if (users.has(name)) {
    const user = users.get(name);
    if (user.password === password) {
      return { name, index: user.index, error: false };
    } else {
      return { error: true, errorText: "Error password" };
    }
  } else {
    const index = users.size + 1;
    users.set(name, {
      name,
      password,
      index,
      error: false,
      errorText: "",
      id: 0,
      ws,
    });
    return { name, index, error: false, errorText: "" };
  }
};
