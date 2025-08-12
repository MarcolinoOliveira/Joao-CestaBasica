'use client'

import { DocumentData } from "firebase/firestore";
import { Button } from "../ui/button";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { getDaysLate } from "@/lib/dateFormatter";
import CreateUser from "../global/CreateUser";
import EditMaturity from "./EditMaturity";

interface headerClientProps {
  client: DocumentData
  totalSales: number
  totalPayment: number
}

const HeaderClient = ({ client, totalPayment, totalSales }: headerClientProps) => {

  const [status, setStatus] = useState('')
  const [open, setOpen] = useState(false)
  const [openEditMaturity, setOpenEditMaturity] = useState(false)

  useEffect(() => {
    const newDaysLater = getDaysLate(client.maturity)
    const status = newDaysLater <= 0 ? 'OK' : 'Vencido'
    setStatus(status)
  }, [client])

  return (
    <div className="grid grid-cols-4 gap-y-4 bg-card p-3 font-semibold rounded-2xl">
      <div className="flex gap-2">
        <p className="text-muted-foreground">Nome:</p>
        <p>{client.name}</p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Telefone:</p>
        <p>{client.phone}</p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Rua:</p>
        <p>{client.street}</p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Numero:</p>
        <p>{client.number}</p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Bairro:</p>
        <p>{client.neighborhood}</p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Cidade:</p>
        <p>{client.city}</p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Status:</p>
        <p className={`${client.status === 'active' ? status === 'OK' ? 'text-green-500' : 'text-red-500' : 'text-gray-600'}`}>
          {client.status === 'active' ? status : 'desativado'}
        </p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Vencimento:</p>
        <p>{client.maturity.split("-").reverse().join("/")}</p>
        <p className="text-sm cursor-pointer text-primary underline" onClick={() => setOpenEditMaturity(true)}>Alterar Vencimento</p>
      </div>
      <div className="flex gap-2">
        <p className="text-muted-foreground">Referencia:</p>
        <p>{client.reference}</p>
      </div>
      <div className="flex gap-2 col-span-3 justify-end">
        <Button className="flex gap-1 cursor-pointer" onClick={() => setOpen(true)}>
          <PencilLine className="w-15 h-15" />
          <p>Editar cliente</p>
        </Button>
      </div>
      <CreateUser client={client} open={open} setOpen={setOpen} />
      <EditMaturity id={client.id} openEditMaturity={openEditMaturity} setOpenEditMaturity={setOpenEditMaturity} maturity={client.maturity} />
    </div>
  );
}

export default HeaderClient;