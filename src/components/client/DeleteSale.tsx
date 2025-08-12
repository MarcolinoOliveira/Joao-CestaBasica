'use client'

import ClientsContext from "@/context/ClientsContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog"
import { Dispatch, SetStateAction, use, useState } from "react";
import { onlyClientFinanceProps } from "@/interfaces/interfaces";
import { getMonthPayment } from "@/lib/dateFormatter";
import { deleteSaleClient } from "@/firebase/deleteDocs";
import { toast } from "sonner";
import { Circle } from "lucide-react";

type deleteSaleProps = {
  id: string
  openDelSale: boolean
  setOpenDelSale: Dispatch<SetStateAction<boolean>>
  sale: Partial<onlyClientFinanceProps>
}

export function DeleteSale({ id, openDelSale, setOpenDelSale, sale }: deleteSaleProps) {

  const [loading, setLoading] = useState(false)

  const { payments } = use(ClientsContext)

  const handleDeleteSale = async () => {
    if (!sale.date) return
    setLoading(true)
    const monthPayment = getMonthPayment({ date: sale.date, payments })
    await deleteSaleClient({ id, sale, monthPayment })
    toast.success('Venda excluída com sucesso', { richColors: true })
    setLoading(false)
  }

  return (
    <AlertDialog open={openDelSale} onOpenChange={() => setOpenDelSale(prev => !prev)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua venda
            e removera seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex gap-2 items-center w-full">
            <AlertDialogCancel className="w-1/2 cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSale} className="w-1/2 mt-2 sm:mt-0 text-white cursor-pointer">
              {!loading ? "Continuar" : <Circle className="animate-spin" />}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}