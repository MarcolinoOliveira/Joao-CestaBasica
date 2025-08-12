'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MaskedCurrencyInput from "@/lib/MaskedCurrencyInput";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, use, useState } from "react";
import { Circle } from "lucide-react";
import { saleProps } from "@/interfaces/interfaces";
import { toast } from "sonner";
import { updateStatusClient, updateUserMaturity } from "@/firebase/updateDocs";
import ClientsContext from "@/context/ClientsContext";
import { getMonthPayment } from "@/lib/dateFormatter";
import { createSale } from "@/firebase/addDocs";

interface CreateSaleProps {
  id: string
  openSale: boolean
  setOpenSale: Dispatch<SetStateAction<boolean>>
}

const CreateSale = ({ id, openSale, setOpenSale }: CreateSaleProps) => {

  const [newSale, setNewSale] = useState<Partial<saleProps>>({})
  const [loading, setLoading] = useState(false)

  const { payments } = use(ClientsContext)

  const saveNewSale = async () => {
    if (!newSale.date || !newSale.value || !newSale.maturity) {
      toast.error("Preencha os campos obrigatórios", { richColors: true })
      return
    }
    setLoading(prev => !prev)

    const monthPayment = getMonthPayment({ date: newSale.date, payments })

    await createSale({ id, newSale, monthPayment })
    await updateStatusClient({ id, status: 'active' })

    setLoading(prev => !prev)
    toast.success('Venda feita com sucesso', { richColors: true })
    setOpenSale(prev => !prev)
  }

  return (
    <Dialog open={openSale} onOpenChange={() => setOpenSale(prev => !prev)}>
      <DialogContent className="w-[340px] sm:w-[450px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Dados da venda</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2 flex flex-col items-center gap-2">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Data da venda*:
            </Label>
            <Input
              id="data"
              type="date"
              value={newSale.date ?? ""}
              onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
              min="1900-01-01"
              max="2299-12-31"
            />
          </div>
          <div className="col-span-2 flex flex-col items-center gap-2">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Vencimento*:
            </Label>
            <Input
              id="data"
              type="date"
              value={newSale.maturity ?? ""}
              onChange={(e) => setNewSale({ ...newSale, maturity: e.target.value })}
              min="1900-01-01"
              max="2299-12-31"
            />
          </div>
          <div className="col-span-2 flex flex-col items-center gap-1">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Valor da venda*:
            </Label>
            <MaskedCurrencyInput
              value={newSale.value ?? ""}
              onChange={(e) => setNewSale({ ...newSale, value: e })} />
          </div>
          <div className="col-span-2 flex flex-col items-center gap-1">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Valor de entrada:
            </Label>
            <MaskedCurrencyInput
              value={newSale.payment ?? ""}
              onChange={(e) => setNewSale({ ...newSale, payment: e })} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={saveNewSale} className="w-full cursor-pointer">
            {!loading ? "Salvar" : <Circle className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSale;