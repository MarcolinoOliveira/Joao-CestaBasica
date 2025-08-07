export interface clientProps {
  id: string
  name: string
  street: string
  city: string
  number: string
  neighborhood: string
  reference: string
  phone: string
  status: string
  maturity: string
  date: string
}

export interface saleProps {
  date: string
  value: string
  payment: string
  maturity: string
}

export interface paymentsProps {
  id: string
  saleValue: number
  paymentValue: number
}

export interface onlyClientFinanceProps {
  id: string
  value: string
  date: string
}