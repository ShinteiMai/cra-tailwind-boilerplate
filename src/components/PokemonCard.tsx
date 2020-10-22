import React from "react";
import { Pokemon } from "../features/pokemonSlice";

type Props = Pokemon;

const PokemonCard: React.FC<Props> = ({ name, sprite, id }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <div className="mx-auto w-full flex items-center justify-center">
        <img className="w-40" src={sprite} alt="Sunset in the mountains" />
      </div>

      <div className="px-6 py-4">
        <h1 className="capitalize font-bold text-xl mb-2">{name}</h1>
        <p>Type: Grass</p>
        <p className="text-gray-700 text-base">Text Entry</p>
      </div>
    </div>
  );
};

export default PokemonCard;
