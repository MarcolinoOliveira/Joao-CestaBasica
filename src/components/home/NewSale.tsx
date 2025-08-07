'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MaskedCurrencyInput from "@/lib/MaskedCurrencyInput";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, use, useState } from "react";
import { Circle } from "lucide-react";
import { paymentsProps, saleProps } from "@/interfaces/interfaces";
import { addNewPayment, addNewSale } from "@/firebase/addDocs";
import { toast } from "sonner";
import { updateUserMaturity } from "@/firebase/updateDocs";
import ClientsContext from "@/context/ClientsContext";

interface NewSaleProps {
  id: string
  openSale: boolean
  setOpenSale: Dispatch<SetStateAction<boolean>>
}

const NewSale = ({ id, openSale, setOpenSale }: NewSaleProps) => {

  const [newSale, setNewSale] = useState<Partial<saleProps>>({})
  const [loading, setLoading] = useState(false)

  const { payments } = use(ClientsContext)

  const saveNewSale = async () => {
    if (!newSale.date || !newSale.value || !newSale.maturity) {
      toast.error("Preencha os campos obrigatórios", { richColors: true })
      return
    }
    setLoading(prev => !prev)

    const date = new Date(newSale.date)
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}`
    let monthPayment: paymentsProps = { id: "", saleValue: 0, paymentValue: 0 }

    for (let i = 0; i < payments.length; i++) {
      if (payments[i].id === currentDate) {
        monthPayment = payments[i]
        break
      }
    }
    console.log(monthPayment)
    await addNewSale({ id, newSale, monthPayment })
    // if (newSale.payment) await addNewPayment({ id, newSale, payments })
    // await updateUserMaturity({ id, newSale })

    setLoading(prev => !prev)
    toast.success('Cliente cadastrado com sucesso', { richColors: true })
    setOpenSale(prev => !prev)
    setNewSale({})
  }

  return (
    <Dialog open={openSale}>
      <DialogContent className="w-[340px] sm:w-[450px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Dados do cliente</DialogTitle>
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
            {!loading ? "Salvar" : <Circle />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewSale;