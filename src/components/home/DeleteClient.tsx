'use client'

import ClientsContext from "@/context/ClientsContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog"
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { onlyClientFinanceProps } from "@/interfaces/interfaces";
import { getMonthPayment } from "@/lib/dateFormatter";
import { deleteClient, deletePaymentClient, deleteSaleClient } from "@/firebase/deleteDocs";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { getClientPayments, getClientSales } from "@/firebase/getDocs";

type deleteClientProps = {
  id: string
  openDelUser: boolean
  setOpenDelUser: Dispatch<SetStateAction<boolean>>
}

export function DeleteClient({ id, openDelUser, setOpenDelUser }: deleteClientProps) {

  const [clientPayments, setClientPayments] = useState<onlyClientFinanceProps[]>([])
  const [clientSales, setClientSales] = useState<onlyClientFinanceProps[]>([])
  const [loading, setLoading] = useState(false)

  const { payments } = use(ClientsContext)

  useEffect(() => {
    getClientPayments({ id, setClientPayments })
    getClientSales({ id, setClientSales })
  }, [id])

  const handleDeleteClient = async () => {
    setLoading(true)
    clientPayments.forEach(async (e) => {
      const monthPayment = getMonthPayment({ date: e.date, payments })
      await deletePaymentClient({ id, payment: e, maturity: '2025-08-13', monthPayment })
      console.log(id, e, '2025-08-13', monthPayment)
    })
    clientSales.forEach(async (e) => {
      const monthPayment = getMonthPayment({ date: e.date, payments })
      await deleteSaleClient({ id, sale: e, monthPayment })
      console.log(id, e, monthPayment)
    })

    await deleteClient({ id })
    setLoading(false)
    toast.success('Cliente excluido com sucesso', { richColors: true })
  }

  return (
    <AlertDialog open={openDelUser} onOpenChange={() => setOpenDelUser(prev => !prev)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente seu
            cliente e removera seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex gap-2 items-center w-full">
            <AlertDialogCancel className="w-1/2 cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="w-1/2 mt-2 sm:mt-0 text-white cursor-pointer">
              {!loading ? "Continuar" : <LoaderCircle className="animate-spin" />}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}