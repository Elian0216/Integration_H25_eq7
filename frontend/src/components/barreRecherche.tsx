import React from 'react'
import { useState } from 'react';
import { Search } from 'lucide-react';


const BarreDeRecherche = () => {
  const [token, setToken] = useState("BTC");
  const [inputValue, setInputValue] = useState("");

  // const userTokens = await fetch("/api/user/tokens", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // }).then((res) => res.json());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setToken(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        onClick={handleSubmit}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4"
      />
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Rechercher un actif..."
        className="bg-zinc-800 border-zinc-700 pl-9 w-full sm:w-64"
      />
    </form>
  )
}

export default BarreDeRecherche
