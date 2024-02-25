
export const createJsonMessage = (type: string, data: object) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });
};

export function parseJsonSafely(data: string) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}
