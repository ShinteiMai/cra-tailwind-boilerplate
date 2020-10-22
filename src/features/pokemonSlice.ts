import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceTypes } from "./types";
import fromApi from "../api/fromApi";
import { SliceStatus } from "../globals";
import { RootState } from "./store";
import { wrapReduxAsyncHandler } from "./wrapReduxAsyncHandler";

type Pokemon = {
  id: number;
  name: string;
  baseExperience: number;
  height: number;
  isDefault: boolean;
  order: number;
  weight: number;
  sprite: string;
};

type NamedAPIResource = {
  name: string;
  url: string;
};

type SliceState = {
  data: Pokemon[];
  status: {
    state: SliceStatus;
    type: SliceTypes | null;
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
  name: "pokemon",
  initialState,
  reducers: {
    initialize(state, action: PayloadAction<{ reducerType: SliceTypes }>) {
      const { reducerType } = action.payload;
      state.status.type = reducerType;
      state.status.state = SliceStatus.LOADING;
    },
    error(state, action: PayloadAction<{ reducerType: SliceTypes }>) {
      const { reducerType } = action.payload;
      state.status.type = reducerType;
      state.status.state = SliceStatus.ERROR;
    },
    success(state, action: PayloadAction<{ reducerType: SliceTypes }>) {
      const { reducerType } = action.payload;
      state.status.type = reducerType;
      state.status.state = SliceStatus.SUCCESS;
    },
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
  SliceTypes.getPokemonsReducer,
  async (dispatch) => {
    const { results } = await fromApi.getPokemons(5, 5);
    const pokemons: Pokemon[] = [];
    for await (const { url } of results) {
      const pokemonId = Number(url.split("/").slice(-2)[0]);
      const pokemon = await fromApi.getPokemonById(pokemonId);
      pokemons.push({
        id: pokemon.id,
        name: pokemon.name,
        baseExperience: pokemon.base_experience,
        height: pokemon.height,
        isDefault: pokemon.is_default,
        order: pokemon.order,
        weight: pokemon.weight,
        sprite: pokemon.sprites.front_default,
      });
    }

    dispatch(getPokemonsReducer({ pokemons }));
  }
);

export const getPokemonByName = wrapReduxAsyncHandler(
  statusHandler,
  SliceTypes.getPokemonByNameReducer,
  async (dispatch, { name }) => {}
);
