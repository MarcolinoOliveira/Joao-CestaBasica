import { clientProps, onlyClientFinanceProps, paymentsProps } from "@/interfaces/interfaces";
import { getNewMaturity } from "@/lib/dateFormatter";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";

interface createUserProps {
  newClient: Partial<clientProps>
}

interface addNewPaymentProps {
  id: string
  maturity: string
  newPayment: Partial<onlyClientFinanceProps>
  monthPayment: paymentsProps
}

interface addNewSaleProps {
  id: string
  newSale: Partial<onlyClientFinanceProps>
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

export async function addNewPayment({ id, newPayment, monthPayment, maturity }: addNewPaymentProps) {
  if (!id || !newPayment || !newPayment.value || !newPayment.date) return

  const ref = collection(db, `clients/${id}/payments`)
  const refClient = doc(db, 'clients', id)
  const paymentNumber = parseFloat(newPayment.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const total = monthPayment.paymentValue + paymentNumber

  const date = new Date(newPayment.date)
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}`

  const newMaturity = getNewMaturity(maturity)

  const payload = {
    date: newPayment.date,
    value: newPayment.value,
  }

  await addDoc(ref, payload)
  await updateDoc(refClient, { maturity: newMaturity })

  if (monthPayment.id) {
    const refTotal = doc(db, 'payments', monthPayment.id)
    await updateDoc(refTotal, { paymentValue: total })
  }
  if (!monthPayment.id) {
    const refTotal = doc(db, 'payments', currentDate)
    await setDoc(refTotal, { saleValue: 0, paymentValue: paymentNumber })
  }
}

export async function addNewSale({ id, newSale, monthPayment }: addNewSaleProps) {
  if (!id || !newSale.value || !newSale.date) return

  const ref = collection(db, `clients/${id}/sales`)
  const refUp = doc(db, 'clients', id)

  const saleNumber = parseFloat(newSale.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const total = monthPayment.saleValue + saleNumber

  const date = new Date(newSale.date)
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}`

  const newMaturity = getNewMaturity(newSale.date)

  const payload = {
    date: newSale.date,
    value: newSale.value,
  }

  await addDoc(ref, payload)
  await updateDoc(refUp, { maturity: newMaturity, status: 'active' })

  if (monthPayment.id) {
    const refTotal = doc(db, 'payments', monthPayment.id)
    await updateDoc(refTotal, { saleValue: total })
  }
  if (!monthPayment.id) {
    const refTotal = doc(db, 'payments', currentDate)
    await setDoc(refTotal, { saleValue: saleNumber, paymentValue: 0 })
  }
}