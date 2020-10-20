import { combineReducers, configureStore } from "@reduxjs/toolkit";
import pokemonSlice from "./pokemonSlice";

const rootReducer = combineReducers({
  pokemons: pokemonSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default store;
