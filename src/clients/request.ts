export default async function request<Response>(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as Response;
}
