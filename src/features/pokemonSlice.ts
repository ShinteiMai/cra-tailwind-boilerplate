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
    getPokemonsReducer(state, action: PayloadAction<{ results: Pokemon[] }>) {
      const { results } = action.payload;
      console.log(results);
      state.data = results;
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
    const { results } = await fromApi.getPokemons(10, 10);
    console.log(results);
    dispatch(getPokemonsReducer({ results }));
  }
);

export const getPokemonByName = wrapReduxAsyncHandler(
  statusHandler,
  SliceTypes.getPokemonByNameReducer,
  async (dispatch, { name }) => {}
);
