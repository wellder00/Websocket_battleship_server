import { dataPlayer, roomData } from "./type/interface";

export const createJsonMessage = (type: string, data: object) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
};

export function parseJsonSafely(data: string): { name: string; password: string } | null {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}
