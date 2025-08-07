import { clientProps, paymentsProps, saleProps } from "@/interfaces/interfaces";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";

interface createUserProps {
  newClient: Partial<clientProps>
}

interface newSaleProps {
  id: string
  newSale: Partial<saleProps>
  monthPayment: paymentsProps
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

export async function addNewSale({ id, newSale, monthPayment }: newSaleProps) {
  if (!id || !newSale.date || !newSale.value) return

  const date = new Date(newSale.date)
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}`

  const ref = collection(db, `clients/${id}/sales`)

  const payload = {
    date: newSale.date,
    value: newSale.value,
  }

  const newSaleValue = monthPayment.saleValue + parseFloat(newSale.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const newSPaymentValue = newSale.payment ? monthPayment.paymentValue + parseFloat(newSale.payment.replace(/R\$\s?|/g, '').replace(',', '.')) : monthPayment.paymentValue
  //await addDoc(ref, payload)

  if (monthPayment.id != "") {
    const refPay = doc(db, 'payments', monthPayment.id)
    //await updateDoc(refPay, { saleValue: newSaleValue, paymentValue: newSPaymentValue })
  } else {
    const refPay = doc(db, 'payments', currentDate)
    //await addDoc(refPay, { saleValue: newSaleValue, paymentValue: newSPaymentValue })
  }
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