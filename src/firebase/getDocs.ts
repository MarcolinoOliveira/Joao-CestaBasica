import { clientProps, onlyClientFinanceProps, paymentsProps } from "@/interfaces/interfaces";
import { getDaysLate } from "@/lib/dateFormatter";
import { db } from "@/lib/firebase";
import { collection, doc, DocumentData, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

interface getAllClientsProps {
  setClients: Dispatch<SetStateAction<clientProps[]>>
}

interface getAllClientsDesabledProps {
  setClientsInactive: Dispatch<SetStateAction<clientProps[]>>
}

interface getMonthsPaymentsProps {
  setPayments: Dispatch<SetStateAction<paymentsProps[]>>
}

interface getClientPaymentsProps {
  id: string
  setClientPayments: Dispatch<SetStateAction<onlyClientFinanceProps[]>>
  setLastIdPayment: Dispatch<SetStateAction<string>>
}

interface getClientSalesProps {
  id: string
  setClientSales: Dispatch<SetStateAction<onlyClientFinanceProps[]>>
}

interface getClientProps {
  id: string
  setClient: Dispatch<SetStateAction<DocumentData>>
}

export function getAllClients({ setClients }: getAllClientsProps) {
  const ref = query(collection(db, "clients"), where("status", "==", "active"), orderBy('name'))
  onSnapshot(ref, (snapshot) => {
    const res = snapshot.docs.map((doc) => {
      const { city, maturity, name, neighborhood, number, phone, reference, street, date } = doc.data() as clientProps

      const newDaysLater = getDaysLate(maturity)
      const status = newDaysLater <= 0 ? 'OK' : 'Vencido'
      const id = doc.id

      return { id, city, name, neighborhood, number, phone, reference, street, status, maturity, date }
    })
    setClients(res)
  })
}

export function getAllClientsDesabled({ setClientsInactive }: getAllClientsDesabledProps) {
  const ref = query(collection(db, "clients"), where("status", "==", "desabled"), orderBy('name'))
  onSnapshot(ref, (snapshot) => {
    const res = snapshot.docs.map((doc) => ({ ...doc.data() as clientProps, id: doc.id }))
    setClientsInactive(res)
  })
}

export async function getMonthsPayments({ setPayments }: getMonthsPaymentsProps) {
  const ref = collection(db, 'payments')

  onSnapshot(query(ref), (snapshot) => {
    const dataPayments = snapshot.docs.map((doc) => ({ ...doc.data() as paymentsProps, id: doc.id }))
    setPayments(dataPayments)
  })
}

export async function getClientPayments({ id, setClientPayments, setLastIdPayment }: getClientPaymentsProps) {
  if (id) {
    const ref = collection(db, `clients/${id}/payments`)
    onSnapshot(query(ref, orderBy('date', "desc")), (snapshot) => {
      const res = snapshot.docs.map((doc) => ({ ...doc.data() as onlyClientFinanceProps, id: doc.id }))
      setClientPayments(res)
      if (res[0]) setLastIdPayment(res[0].id)
    })
  }
}

export async function getClientSales({ id, setClientSales }: getClientSalesProps) {
  if (id) {
    const ref = collection(db, `clients/${id}/sales`)
    onSnapshot(query(ref, orderBy('date', 'desc')), (snapshot) => {
      const res = snapshot.docs.map((doc) => ({ ...doc.data() as onlyClientFinanceProps, id: doc.id }))
      setClientSales(res)
    })
  }
}

export async function getClient({ id, setClient }: getClientProps) {
  if (id) {
    const ref = doc(db, 'clients', id)
    onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        setClient({ ...doc.data(), id: doc.id })
      }
    })
  }
}