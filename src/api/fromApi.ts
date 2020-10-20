import { HTTP_METHODS } from "../globals";
import { createApiRequest } from "./axios";

class ApiCallCreator {
  getPokemons() {
    return createApiRequest("/pokemon", HTTP_METHODS.GET, {});
  }

  getPokemonByName(name: string) {
    return createApiRequest(`/pokemon/${name}`, HTTP_METHODS.GET, {});
  }
}

const fromApi = new ApiCallCreator();
export default fromApi;
