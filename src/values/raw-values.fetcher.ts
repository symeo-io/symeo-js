import fetch from 'sync-fetch';
import YAML from 'yamljs';

export class RawValuesFetcher {
  public fetchFromApi(apiUrl: string, apiKey: string) {
    const response = fetch(apiUrl, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error when fetching config: ${response.statusText}`);
    }

    return response.json().values;
  }

  public fetchFromFile(path: string) {
    return YAML.load(path);
  }
}
