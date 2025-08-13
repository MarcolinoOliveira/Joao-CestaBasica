'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MaskedCurrencyInput from "@/lib/MaskedCurrencyInput";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { onlyClientFinanceProps } from "@/interfaces/interfaces";
import { toast } from "sonner";
import { addNewSale } from "@/firebase/addDocs";
import { updateSaleClient } from "@/firebase/updateDocs";
import ClientsContext from "@/context/ClientsContext";
import { getMonthPayment } from "@/lib/dateFormatter";

interface newSaleProps {
  id: string
  sale: Partial<onlyClientFinanceProps>
  openSale: boolean
  setOpenSale: Dispatch<SetStateAction<boolean>>
}

const NewSale = ({ id, sale, openSale, setOpenSale }: newSaleProps) => {

  const [newSale, setNewSale] = useState<Partial<onlyClientFinanceProps>>({})
  const [loading, setLoading] = useState(false)

  const { payments } = use(ClientsContext)

  useEffect(() => {
    setNewSale(sale)
  }, [sale])

  const handleSaveSale = async () => {
    if (!newSale.date || !newSale.value) {
      toast.error('Preencha os campos obrigatórios', { richColors: true })
      return
    }
    setLoading(true)

    const monthPayment = getMonthPayment({ date: newSale.date, payments })

    if (sale.id) {
      await updateSaleClient({ id, sale, newSale, monthPayment })
      toast.success('Venda modificada com sucesso', { richColors: true })
    }
    if (!sale.id) {
      await addNewSale({ id, newSale, monthPayment })
      toast.success('Venda adicionada com sucesso', { richColors: true })
    }

    setLoading(false)
    setOpenSale(prev => !prev)
  }

  return (
    <Dialog open={openSale} onOpenChange={() => setOpenSale(prev => !prev)}>
      <DialogContent className="w-[340px] sm:w-[400px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Dados da venda</DialogTitle>
        </DialogHeader>
        <div className="grid w-full gap-2">
          <div className="flex flex-col items-center gap-2">
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
          <div className="flex flex-col items-center gap-1">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Valor da venda*:
            </Label>
            <MaskedCurrencyInput
              value={newSale.value ?? ""}
              onChange={(e) => setNewSale({ ...newSale, value: e })} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveSale} className="w-full cursor-pointer">
            {!loading ? "Salvar" : <LoaderCircle className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewSale;