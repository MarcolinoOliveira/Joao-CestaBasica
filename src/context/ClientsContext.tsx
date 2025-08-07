'use client'


import { clientProps } from "@/interfaces/interfaces"
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

interface ClientsContextProps {
  clients: clientProps[]
  //allPayments: allPaymentsProps[]
  setClients: Dispatch<SetStateAction<clientProps[]>>
  //setAllPayments: Dispatch<SetStateAction<allPaymentsProps[]>>
}

const ClientsContext = createContext({} as ClientsContextProps)

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<clientProps[]>([])
  //const [allPayments, setAllPayments] = useState<allPaymentsProps[]>([])

  return (
    <ClientsContext.Provider value={{ clients, setClients }}>
      {children}
    </ClientsContext.Provider>
  )
}

export default ClientsContext