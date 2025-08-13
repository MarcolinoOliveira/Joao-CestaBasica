'use client'

import { getClient, getClientPayments, getClientSales } from "@/firebase/getDocs";
import { onlyClientFinanceProps } from "@/interfaces/interfaces";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LoaderCircle, PencilLine, SquareX } from "lucide-react";
import NewPayment from "./NewPayment";
import NewSale from "./NewSale";
import HeaderClient from "./HeaderClient";
import CreateSale from "../global/CreateSale";
import { DeletePayment } from "./DeletePayment";
import { DeleteSale } from "./DeleteSale";
import { toast } from "sonner";

interface clientFinanceProps {
  id: string
}

const ClientFinance = ({ id }: clientFinanceProps) => {

  const [client, setClient] = useState<DocumentData>()
  const [clientPayments, setClientPayments] = useState<onlyClientFinanceProps[]>([])
  const [clientSales, setClientSales] = useState<onlyClientFinanceProps[]>([])
  const [lastIdPayment, setLastIdPayment] = useState('')

  const [openSale, setOpenSale] = useState(false)
  const [openPayment, setOpenPayment] = useState(false)
  const [editSale, setEditSale] = useState<Partial<onlyClientFinanceProps>>({})
  const [editPayment, setEditPayment] = useState<Partial<onlyClientFinanceProps>>({})
  const [openDelPay, setOpenDelPay] = useState(false)
  const [openDelSale, setOpenDelSale] = useState(false)

  useEffect(() => {
    getClient({ id, setClient })
    getClientPayments({ id, setClientPayments, setLastIdPayment })
    getClientSales({ id, setClientSales })
  }, [id])

  const totalSales = clientSales.reduce((acc, curr) => acc + parseFloat(curr.value?.replace(/R\$\s?|/g, '').replace(',', '.')), 0)
  const totalPayment = clientPayments.reduce((acc, curr) => acc + parseFloat(curr.value?.replace(/R\$\s?|/g, '').replace(',', '.')), 0)
  const total = totalSales - totalPayment

  const handleSale = (sale: Partial<onlyClientFinanceProps>) => {
    setEditSale(sale)
    setOpenSale(prev => !prev)
  }

  const handlePayment = (payment: Partial<onlyClientFinanceProps>) => {
    setEditPayment(payment)
    setOpenPayment(prev => !prev)
  }

  const handleDeletePayment = (payment: Partial<onlyClientFinanceProps>) => {
    setEditPayment(payment)
    setOpenDelPay(prev => !prev)
  }

  const handleDeleteSale = (sale: Partial<onlyClientFinanceProps>) => {

    if (!sale.value) return

    const numberValue = parseFloat(sale.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
    if (total - numberValue < 0) {
      toast.error('Exclusão inválida', { richColors: true })
      return
    }
    setEditSale(sale)
    setOpenDelSale(prev => !prev)
  }

  if (!client) return <div className="flex items-center w-full h-[80vh] justify-center gap-2"><LoaderCircle />Carregando...</div>

  return (
    <div className="flex flex-col gap-8">
      <HeaderClient client={client} totalPayment={totalPayment} totalSales={totalSales} />
      <div className="flex flex-col border border-card rounded-2xl">
        <div className="grid grid-cols-3 w-full p-3 font-bold bg-card rounded-t-2xl">
          <p className="flex justify-start items-center">Total Vendido: {totalSales?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="flex justify-center items-center">Cestas Básicas</p>
          <div className="flex justify-end">
            <Button onClick={() => handleSale({})} className="cursor-pointer">
              <p>Nova venda</p>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 py-1 px-3 font-semibold border-b border-card text-muted-foreground">
          <p className="flex items-center justify-start">Tipo</p>
          <p className="flex items-center justify-center">Valor</p>
          <p className="flex items-center justify-center">Data da venda</p>
          <p className="flex items-center justify-end">Ações</p>
        </div>
        {clientSales.map((e, i) => (
          <div key={i} className="grid grid-cols-4 p-3 font-semibold border-b border-card last:rounded-2xl">
            <p className="flex justify-start items-center">Cesta básica</p>
            <p className="flex justify-center items-center">{e.value}</p>
            <p className="flex justify-center items-center">{e.date.split('-').reverse().join('/')}</p>
            <div className="flex justify-end gap-2">
              <PencilLine size={20} onClick={() => handleSale(e)} className="cursor-pointer mr-3 hover:text-primary" />
              <SquareX onClick={() => handleDeleteSale(e)} className="cursor-pointer text-red-500" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col border border-card rounded-2xl">
        <div className="grid grid-cols-3 w-full p-3 font-bold bg-card rounded-t-2xl">
          <p className="flex justify-start items-center">Total Pago: {totalPayment?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="flex justify-center items-center">Pagamentos</p>
          <div className="flex justify-end">
            <Button onClick={() => handlePayment({})} className="cursor-pointer">
              <p>Receber pagamento</p>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 py-1 px-3 font-semibold border-b border-card text-muted-foreground">
          <p className="flex items-center justify-start">Tipo</p>
          <p className="flex items-center justify-center">Valor</p>
          <p className="flex items-center justify-center">Data do pagamento</p>
          <p className="flex items-center justify-end">Ações</p>
        </div>
        {clientPayments.map((e, i) => (
          <div key={i} className="grid grid-cols-4 p-3 font-semibold border-b border-card last:rounded-2xl">
            <p className="flex justify-start items-center">pagamento</p>
            <p className="flex justify-center items-center">{e.value}</p>
            <p className="flex justify-center items-center">{e.date.split('-').reverse().join('/')}</p>
            <div className="flex justify-end gap-2">
              <PencilLine size={20} onClick={() => handlePayment(e)} className="cursor-pointer mr-3 hover:text-primary" />
              {lastIdPayment === e.id && <SquareX onClick={() => handleDeletePayment(e)} className="cursor-pointer text-red-500" />}
              {lastIdPayment != e.id && <SquareX className="text-card" />}
            </div>
          </div>
        ))}
      </div>
      {client.status === 'active' && <NewSale id={id} sale={editSale} openSale={openSale} setOpenSale={setOpenSale} />}
      {client.status === 'desabled' && <CreateSale id={id} openSale={openSale} setOpenSale={setOpenSale} />}
      {!clientSales[0]?.id && <CreateSale id={id} openSale={openSale} setOpenSale={setOpenSale} />}
      <NewPayment id={id} payment={editPayment} openPayment={openPayment} setOpenPayment={setOpenPayment} maturity={client?.maturity} total={total} />
      <DeletePayment id={id} payment={editPayment} openDelPay={openDelPay} setOpenDelPay={setOpenDelPay} maturity={client?.maturity} />
      <DeleteSale id={id} sale={editSale} openDelSale={openDelSale} setOpenDelSale={setOpenDelSale} />
    </div>
  );
}

export default ClientFinance;