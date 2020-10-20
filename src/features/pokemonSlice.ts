import { createSlice } from "@reduxjs/toolkit";
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
};

type SliceState = {
  pokemons: Pokemon[];
  status: {
    state: SliceStatus;
  };
};

const initialState: SliceState = {
  pokemons: [],
  status: {
    state: SliceStatus.IDLE,
  },
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    initialize(state, action) {
      state.status.state = SliceStatus.LOADING;
    },
    error(state, action) {
      state.status.state = SliceStatus.ERROR;
    },
    success(state, action) {
      state.status.state = SliceStatus.SUCCESS;
    },
    getPokemonsReducer(state, action) {
      const { results } = action.payload;
      console.log(results);
      state.pokemons = results;
    },
    getPokemonByNameReducer(state, action) {
      const payload = action.payload;
      state.pokemons.push(payload);
    },
  },
});

export const {
  initialize,
  error,
  success,
  getPokemonsReducer,
  getPokemonByNameReducer,
} = pokemonSlice.actions;
export const pokemonSelector = (state: RootState) => state.pokemons.pokemons;
export const pokemonStatusSelector = (state: RootState) =>
  state.pokemons.status;

const statusHandler = { initialize, error, success };

export const getPokemons = wrapReduxAsyncHandler(
  statusHandler,
  async (dispatch, {}) => {
    const { results } = await fromApi.getPokemons();
    console.log(results);
    dispatch(getPokemonsReducer({ results }));
  }
);

export const getPokemonByName = wrapReduxAsyncHandler(
  statusHandler,
  async (dispatch, { name }) => {
    const { results } = await fromApi.getPokemonByName(name);
  }
);

export default pokemonSlice.reducer;
