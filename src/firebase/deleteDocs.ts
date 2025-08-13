import { onlyClientFinanceProps, paymentsProps } from "@/interfaces/interfaces"
import { getPreviousMaturity } from "@/lib/dateFormatter"
import { db } from "@/lib/firebase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"

interface deleteClientProps {
  id: string
}
interface deletePaymentClientProps {
  id: string
  payment: Partial<onlyClientFinanceProps>
  maturity: string
  monthPayment: paymentsProps
}

interface deleteSaleClientProps {
  id: string
  sale: Partial<onlyClientFinanceProps>
  monthPayment: paymentsProps
}

export async function deleteClient({ id }: deleteClientProps) {
  if (!id) return

  const ref = doc(db, 'clients', id)

  await deleteDoc(ref)
}

export async function deletePaymentClient({ id, payment, maturity, monthPayment }: deletePaymentClientProps) {
  if (!id || !payment.id || !payment.value) return

  const refDel = doc(db, `clients/${id}/payments`, payment.id)
  const refUpd = doc(db, 'clients', id)
  const refPayments = doc(db, 'payments', monthPayment.id)

  const lastMaturity = getPreviousMaturity(maturity)
  const valueNumber = parseFloat(payment.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const newTotal = monthPayment.paymentValue - valueNumber

  await updateDoc(refUpd, { maturity: lastMaturity })
  await updateDoc(refPayments, { paymentValue: newTotal })
  await deleteDoc(refDel)
}

export async function deleteSaleClient({ id, sale, monthPayment }: deleteSaleClientProps) {
  if (!id || !sale.id || !sale.value) return

  const refDel = doc(db, `clients/${id}/sales`, sale.id)
  const refPayments = doc(db, 'payments', monthPayment.id)

  const valueNumber = parseFloat(sale.value?.replace(/R\$\s?|/g, '').replace(',', '.'))
  const newTotal = monthPayment.saleValue - valueNumber

  await deleteDoc(refDel)
  await updateDoc(refPayments, { saleValue: newTotal })
}