import { clientProps, onlyClientFinanceProps, paymentsProps } from "@/interfaces/interfaces";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

interface updateUserProps {
  newClient: Partial<clientProps>
}

interface updateUserMaturity {
  id: string
  newMaturity: string
}

interface updatePaymentClientProps {
  id: string
  payment: Partial<onlyClientFinanceProps>
  newPayment: Partial<onlyClientFinanceProps>
  monthPayment: paymentsProps
}

interface updateSaleClientProps {
  id: string
  sale: Partial<onlyClientFinanceProps>
  newSale: Partial<onlyClientFinanceProps>
  monthPayment: paymentsProps
}

interface updateStatusClientProps {
  id: string
  status: string
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

export async function updateUserMaturity({ id, newMaturity }: updateUserMaturity) {
  if (!id) return

  const ref = doc(db, 'clients', id)

  await updateDoc(ref, { maturity: newMaturity })
}

export async function updatePaymentClient({ id, payment, newPayment, monthPayment }: updatePaymentClientProps) {
  if (!id || !payment.value || !newPayment.value || !newPayment.date || !newPayment.id) return

  const ref = doc(db, `clients/${id}/payments`, newPayment.id)
  const paymentNumber = parseFloat(newPayment.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const oldPayment = parseFloat(payment.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const newPaymentValue = paymentNumber - oldPayment
  const total = monthPayment.paymentValue + newPaymentValue

  const date = new Date(newPayment.date)
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}`

  const payload = {
    date: newPayment.date,
    value: newPayment.value,
  }

  await updateDoc(ref, payload)

  if (monthPayment.id) {
    const refTotal = doc(db, 'payments', monthPayment.id)
    await updateDoc(refTotal, { paymentValue: total })
  }
  if (!monthPayment.id) {
    const refTotal = doc(db, 'payments', currentDate)
    await setDoc(refTotal, { saleValue: 0, paymentValue: paymentNumber })
  }
}

export async function updateSaleClient({ id, sale, newSale, monthPayment }: updateSaleClientProps) {
  if (!id || !newSale.value || !newSale.date || !sale.value || !newSale.id) return

  const ref = doc(db, `clients/${id}/sales`, newSale.id)
  const saleNumber = parseFloat(newSale.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const oldSale = parseFloat(sale.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const newSaleNumber = saleNumber - oldSale
  const total = monthPayment.saleValue + newSaleNumber

  const date = new Date(newSale.date)
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}`

  const payload = {
    date: newSale.date,
    value: newSale.value,
  }

  await updateDoc(ref, payload)

  if (monthPayment.id) {
    const refTotal = doc(db, 'payments', monthPayment.id)
    await updateDoc(refTotal, { saleValue: total })
  }
  if (!monthPayment.id) {
    const refTotal = doc(db, 'payments', currentDate)
    await setDoc(refTotal, { saleValue: saleNumber, paymentValue: 0 })
  }
}

export async function updateStatusClient({ id, status }: updateStatusClientProps) {
  if (!id || !status) return

  const ref = doc(db, 'clients', id)

  await updateDoc(ref, { status: status })
}