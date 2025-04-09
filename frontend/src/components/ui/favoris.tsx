"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BotIcon, BotOff, Star, Trash, Trash2 } from "lucide-react";

interface FavorisProps {
    tokens: string[];
    setTokens?: React.Dispatch<React.SetStateAction<string>>;
}
const handleSupprimer = (token: string) => {
    // Logique pour supprimer le token des favoris
    console.log(`Supprimer ${token} des favoris`);
  }
function Favoris({ tokens, setTokens }: FavorisProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Star />
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {tokens.map((token, index) => (
                <DropdownMenuItem className="flex justify-between p-2" key={index} onClick={() => setTokens}>
                    {token}
                    <Trash2 className="text-red-500" onClick={() => handleSupprimer(token)} />
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
         
  )
}

export default Favoris