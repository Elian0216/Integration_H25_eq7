"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star } from "lucide-react";

interface FavorisProps {
    tokens: string[];
    setTokens?: React.Dispatch<React.SetStateAction<string[]>>;
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
                <DropdownMenuItem key={index} onClick={() => setTokens(tokens.filter((_, i) => i !== index))}>
                    {token}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
         
  )
}

export default Favoris