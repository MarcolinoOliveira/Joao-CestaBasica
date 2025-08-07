import { clientProps } from "@/interfaces/interfaces";
import { getDaysLate } from "@/lib/dateFormatter";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

interface getAllClientsProps {
  setClients: Dispatch<SetStateAction<clientProps[]>>
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