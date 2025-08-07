import { clientProps, saleProps } from "@/interfaces/interfaces";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

interface createUserProps {
  newClient: Partial<clientProps>
}

interface newSaleProps {
  id: string
  newSale: Partial<saleProps>
}

export async function createUser({ newClient }: createUserProps) {
  if (!newClient.id) return

  const ref = doc(db, 'clients', newClient.id)

  const payload = {
    name: newClient.name,
    street: newClient.street ?? "",
    city: newClient.city ?? "",
    number: newClient.number ?? "",
    neighborhood: newClient.neighborhood ?? "",
    reference: newClient.reference ?? "",
    phone: newClient.phone ?? "",
    status: 'active',
  }

  await setDoc(ref, payload)
}

export async function addNewSale({ id, newSale }: newSaleProps) {
  if (!id) return

  const ref = collection(db, `clients/${id}/sales`)

  const payload = {
    date: newSale.date,
    value: newSale.value,
  }

  await addDoc(ref, payload)
}

export async function addNewPayment({ id, newSale }: newSaleProps) {
  if (!id) return

  const ref = collection(db, `clients/${id}/payments`)

  const payload = {
    date: newSale.date,
    value: newSale.payment,
  }

  await addDoc(ref, payload)
}