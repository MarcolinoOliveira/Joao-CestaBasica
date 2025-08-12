'use client'

import ClientsContext from "@/context/ClientsContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog"
import { Dispatch, SetStateAction, use, useState } from "react";
import { onlyClientFinanceProps } from "@/interfaces/interfaces";
import { getMonthPayment } from "@/lib/dateFormatter";
import { deletePaymentClient } from "@/firebase/deleteDocs";
import { toast } from "sonner";
import { Circle } from "lucide-react";

type deletePaymentProps = {
  id: string
  openDelPay: boolean
  setOpenDelPay: Dispatch<SetStateAction<boolean>>
  payment: Partial<onlyClientFinanceProps>
  maturity: string
}

export function DeletePayment({ id, openDelPay, setOpenDelPay, payment, maturity }: deletePaymentProps) {

  const [loading, setLoading] = useState(false)

  const { payments } = use(ClientsContext)

  const handleDeletePayment = async () => {
    if (!payment.date) return
    setLoading(true)
    const monthPayment = getMonthPayment({ date: payment.date, payments })
    await deletePaymentClient({ id, payment, maturity, monthPayment })
    toast.success('Pagamento excluido com sucesso', { richColors: true })
    setLoading(false)
  }

  return (
    <AlertDialog open={openDelPay} onOpenChange={() => setOpenDelPay(prev => !prev)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente seu
            pagamento e removera seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex gap-2 items-center w-full">
            <AlertDialogCancel className="w-1/2 cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePayment} className="w-1/2 mt-2 sm:mt-0 text-white cursor-pointer">
              {!loading ? "Continuar" : <Circle className="animate-spin" />}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}