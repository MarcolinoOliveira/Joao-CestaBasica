import { clientProps, saleProps } from "@/interfaces/interfaces";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";

interface updateUserProps {
  newClient: Partial<clientProps>
}

interface updateUserMaturity {
  id: string
  newSale: Partial<saleProps>
}

export async function updateUser({ newClient }: updateUserProps) {
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

  await updateDoc(ref, payload)
}

export async function updateUserMaturity({ id, newSale }: updateUserMaturity) {
  if (!id) return

  const ref = doc(db, 'clients', id)

  const payload = {
    maturity: newSale.maturity ?? "",
    date: newSale.date ?? ""
  }

  await updateDoc(ref, payload)
}