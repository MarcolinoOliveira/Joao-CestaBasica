'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MaskedCurrencyInput from "@/lib/MaskedCurrencyInput";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { onlyClientFinanceProps, paymentsProps } from "@/interfaces/interfaces";
import { toast } from "sonner";
import { getMonthPayment } from "@/lib/dateFormatter";
import ClientsContext from "@/context/ClientsContext";
import { addNewPayment } from "@/firebase/addDocs";
import { updatePaymentClient, updateStatusClient } from "@/firebase/updateDocs";

interface newPaymentProps {
  id: string
  payment: Partial<onlyClientFinanceProps>
  maturity: string
  openPayment: boolean
  setOpenPayment: Dispatch<SetStateAction<boolean>>
  total: number
}

const NewPayment = ({ id, payment, maturity, openPayment, setOpenPayment, total }: newPaymentProps) => {

  const [newPayment, setNewPayment] = useState<Partial<onlyClientFinanceProps>>({})
  const [loading, setLoading] = useState(false)

  const { payments } = use(ClientsContext)

  useEffect(() => {
    setNewPayment(payment)
  }, [payment])

  const handleSavePayment = async () => {
    if (!newPayment.date || !newPayment.value) {
      toast.error('Preencha os campos obrigatórios', { richColors: true })
      return
    }
    setLoading(true)

    const monthPayment = getMonthPayment({ date: newPayment.date, payments })
    const valueNumber = parseFloat(newPayment?.value.replace(/R\$\s?|/g, '').replace(',', '.'))
    const newValue = total - valueNumber

    if (newValue < 0) {
      toast.error('Valor de pagamento inválido', { richColors: true })
      setLoading(false)
      return
    }

    if (newValue === 0) {
      await updateStatusClient({ id, status: 'desabled' })
    }

    if (payment.id) {
      await updatePaymentClient({ id, newPayment, monthPayment, payment })
      toast.success('Pagamento alterado com sucesso', { richColors: true })
    }
    if (!payment.id) {
      await addNewPayment({ id, newPayment, monthPayment, maturity })
      toast.success('Pagamento recebido com sucesso', { richColors: true })
    }

    setLoading(false)
    setOpenPayment(prev => !prev)
  }

  return (
    <Dialog open={openPayment} onOpenChange={() => setOpenPayment(prev => !prev)}>
      <DialogContent className="w-[340px] sm:w-[400px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Dados do pagamento</DialogTitle>
        </DialogHeader>
        <div className="grid w-full gap-2">
          <div className="flex flex-col items-center gap-2">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Data do pagamento*:
            </Label>
            <Input
              id="data"
              type="date"
              value={newPayment.date ?? ""}
              onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
              min="1900-01-01"
              max="2299-12-31"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Valor do pagamento*:
            </Label>
            <MaskedCurrencyInput
              value={newPayment.value ?? ""}
              onChange={(e) => setNewPayment({ ...newPayment, value: e })} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSavePayment} className="w-full cursor-pointer">
            {!loading ? "Salvar" : <LoaderCircle className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewPayment