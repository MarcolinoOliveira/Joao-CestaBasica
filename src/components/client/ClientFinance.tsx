'use client'

import { getClient, getClientPayments, getClientSales } from "@/firebase/getDocs";
import { onlyClientFinanceProps } from "@/interfaces/interfaces";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

interface clientFinanceProps {
  id: string
}

const ClientFinance = ({ id }: clientFinanceProps) => {

  const [client, setClient] = useState<DocumentData>()
  const [clientPayments, setClientPayments] = useState<onlyClientFinanceProps[]>([])
  const [clientSales, setClientSales] = useState<onlyClientFinanceProps[]>([])

  useEffect(() => {
    getClient({ id, setClient })
    getClientPayments({ id, setClientPayments })
    getClientSales({ id, setClientSales })
  }, [id])

  return (
    <div>
      <p>{client?.name}</p>
      {clientSales.map((e, i) => (
        <div key={i}>
          <p>{e.value}</p>
        </div>
      ))}
    </div>
  );
}

export default ClientFinance;