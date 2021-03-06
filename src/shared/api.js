import Swagger from 'swagger-client';
let client = null;

export async function getClient() {
  if (!client) {
    client = await Swagger('/api/v1/swagger.yaml');
  }
  return client;
}

export function checkResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.url}: ${response.statusText}`);
  }
}
