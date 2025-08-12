'use client'

import { Dispatch, SetStateAction } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

interface MenuClientsStatusProps {
  statusClient: string
  setStatusClient: Dispatch<SetStateAction<string>>
  clientsInactives: () => void
}

const MenuClientsStatus = ({ statusClient, setStatusClient, clientsInactives }: MenuClientsStatusProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          {statusClient === 'active' && <p className="text-white font-bold">Clientes Ativados</p>}
          {statusClient === 'desabled' && <p className="text-white font-bold">Clientes Desativados</p>}
          <ChevronDown className="text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto items-start p-1" align='start'>
        <PopoverClose asChild>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setStatusClient("active")} className="text-white font-bold">Ativos</Button>
            <Button onClick={() => clientsInactives()} className="text-white font-bold">Inativos</Button>
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

export default MenuClientsStatus;