import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemons, pokemonsSelector } from "./features/pokemonSlice";
import { SliceStatus } from "./globals";

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const dispatch = useDispatch();
  const pokemons = useSelector(pokemonsSelector);

  useEffect(() => {
    dispatch(getPokemons({}));
  }, [dispatch]);

  const handleButtonClick = () => {};

  return (
    <div className="text-center mt-24 px-24">
      <h1 className="text-4xl">CRA Tailwind CSS Boilerplate</h1>
      <p className="text-lg">
        A sophisticated boilerplate for creating react applications with
        tailwind css
      </p>
      <div className="w-1/2 mt-8 mx-auto flex justify-center">
        <input
          type="text"
          className="w-1/2 bg-white px-4 py-2 focus:outline-none border border-yellow-500 rounded-lg block appearance-none leading-normal"
          value={query}
          placeholder="Find a pokemon!"
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setQuery(e.currentTarget.value)
          }
        />
        <button
          onClick={handleButtonClick}
          className="ml-4 bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded outline:none focus:outline-none"
        >
          Search
        </button>
      </div>
      {pokemons.status.state === SliceStatus.LOADING ? (
        <div>Loading...</div>
      ) : (
        <>
          {pokemons.data.map((pokemon) => (
            <div key={pokemon.id}>
              <p className="capitalize">
                {pokemon.id} - {pokemon.name}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default App;
