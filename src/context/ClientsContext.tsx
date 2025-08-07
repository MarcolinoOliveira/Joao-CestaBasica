'use client'


import { clientProps, paymentsProps } from "@/interfaces/interfaces"
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

interface ClientsContextProps {
  clients: clientProps[]
  payments: paymentsProps[]
  setClients: Dispatch<SetStateAction<clientProps[]>>
  setPayments: Dispatch<SetStateAction<paymentsProps[]>>
}

const ClientsContext = createContext({} as ClientsContextProps)

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<clientProps[]>([])
  const [payments, setPayments] = useState<paymentsProps[]>([])

  return (
    <ClientsContext.Provider value={{ clients, setClients, payments, setPayments }}>
      {children}
    </ClientsContext.Provider>
  )
}

export default ClientsContext