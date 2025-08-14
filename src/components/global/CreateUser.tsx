'use client'

import { clientProps } from "@/interfaces/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MaskedTelephoneInput from "@/lib/MaskedTelephoneInput";
import { createUser } from "@/firebase/addDocs";
import { LoaderCircle } from "lucide-react";
import pushid from 'pushid'
import { toast } from "sonner";
import { updateUser } from "@/firebase/updateDocs";
import NewSale from "./NewSale";

interface CreateUserProps {
  client: Partial<clientProps>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const CreateUser = ({ client, open, setOpen }: CreateUserProps) => {

  const [newClient, setNewClient] = useState<Partial<clientProps>>(client)
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openSale, setOpenSale] = useState(false)

  useEffect(() => {
    if (!client.id) {
      setNewClient({ ...client, id: pushid() })
      setEdit(false)
    } else {
      setNewClient(client)
      setEdit(true)
    }
  }, [client])

  const saveClient = async () => {
    if (!newClient.name) {
      toast.error('Preencha os campos obrigatórios', { richColors: true })
      return
    }
    setLoading(prev => !prev)
    if (!edit) {
      await createUser({ newClient })
      setOpenSale(prev => !prev)
    }
    if (edit) {
      await updateUser({ newClient })
      toast.success('Cliente edidato com sucesso', { richColors: true })
    }
    setOpen(prev => !prev)
    setLoading(prev => !prev)
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
        <DialogContent className="w-[340px] sm:w-[450px]">
          <DialogHeader className="flex items-center justify-center">
            <DialogTitle>Dados do cliente</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Nome:*
              </Label>
              <Input
                id="name"
                type="string"
                value={newClient.name ?? ""}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                required
              />
            </div>
            <div className="col-span-3 flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Rua:
              </Label>
              <Input
                id="street"
                type="string"
                value={newClient.street ?? ""}
                onChange={(e) => setNewClient({ ...newClient, street: e.target.value })}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Nº:
              </Label>
              <Input
                id="number"
                type="string"
                value={newClient.number ?? ""}
                onChange={(e) => setNewClient({ ...newClient, number: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Bairro:
              </Label>
              <Input
                id="neighborhood"
                type="string"
                value={newClient.neighborhood ?? ""}
                onChange={(e) => setNewClient({ ...newClient, neighborhood: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Cidade:
              </Label>
              <Input
                id="city"
                type="string"
                value={newClient.city ?? ""}
                onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Referência:
              </Label>
              <Input
                id="reference"
                type="string"
                value={newClient.reference ?? ""}
                onChange={(e) => setNewClient({ ...newClient, reference: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex flex-col items-center gap-2">
              <Label htmlFor="name" className="text-left w-full font-semibold">
                Telefone:
              </Label>
              <MaskedTelephoneInput
                value={newClient.phone ?? ""}
                onChange={(e) => setNewClient({ ...newClient, phone: e })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveClient} className="w-full cursor-pointer">
              {!loading ? "Salvar" : <LoaderCircle className="animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {newClient.id && <NewSale id={newClient.id} sale={{}} openSale={openSale} setOpenSale={setOpenSale} />}
    </div>
  );
}

export default CreateUser;