import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReducerTypes } from "./reducerTypes";
import fromApi from "../api/fromApi";
import { SliceStatus } from "../globals";
import { RootState } from "./store";
import { wrapReduxAsyncHandler } from "./wrapReduxAsyncHandler";
import { NamedAPIResource } from "./types";
import { statusHandlerReducer } from "./statusHandlerReducer";

export type Pokemon = {
  id: number;
  name: string;
  baseExperience: number;
  height: number;
  isDefault: boolean;
  order: number;
  weight: number;
  abilities: {
    isHidden: boolean;
    slot: number;
    ability: NamedAPIResource;
  }[];
  forms: NamedAPIResource[];
  moves: {
    move: NamedAPIResource;
  }[];
  sprite: string;
  species: NamedAPIResource[];
  stats: {
    baseStat: number;
    effort: number;
    stat: NamedAPIResource;
  }[];
  types: {
    slot: number;
    type: NamedAPIResource;
  };
};

type SliceState = {
  data: Pokemon[];
  status: {
    state: SliceStatus;
    type: ReducerTypes | null;
  };
};

const initialState: SliceState = {
  data: [],
  status: {
    state: SliceStatus.IDLE,
    type: null,
  },
};

const pokemonSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    ...statusHandlerReducer,
    getPokemonsReducer(state, action: PayloadAction<{ pokemons: Pokemon[] }>) {
      const { pokemons } = action.payload;
      state.data = pokemons;
    },
    getPokemonByNameReducer(state, action) {
      const payload = action.payload;
      state.data.push(payload);
    },
  },
});

export const pokemonsReducer = pokemonSlice.reducer;
export const {
  initialize,
  error,
  success,
  getPokemonsReducer,
  getPokemonByNameReducer,
} = pokemonSlice.actions;

export const pokemonsSelector = (state: RootState) => state.pokemons;

const statusHandler = { initialize, error, success };

export const getPokemons = wrapReduxAsyncHandler(
  statusHandler,
  ReducerTypes.getPokemonsReducer,
  async (dispatch) => {
    const { results } = await fromApi.getPokemons(2, 2);

    const pokemons: Pokemon[] = [];
    for await (const { url } of results) {
      const pokemonId = Number(url.split("/").slice(-2)[0]);
      const pokemon = await fromApi.getPokemonById(pokemonId);
      pokemons.push(pokemon);
    }

    dispatch(getPokemonsReducer({ pokemons }));
  }
);

export const getPokemonByName = wrapReduxAsyncHandler(
  statusHandler,
  ReducerTypes.getPokemonByNameReducer,
  async (dispatch, { name }) => {}
);
