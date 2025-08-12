import { onlyClientFinanceProps, paymentsProps } from "@/interfaces/interfaces";

interface getMonthPaymentProps {
  date: string
  payments: paymentsProps[]
}

export const dateFormatterPTBR = (date: Date, locale = 'pt-BR') => {
  return new Intl.DateTimeFormat(locale).format(date)
}

export const getDaysLate = (maturity: string) => {
  const dateBR = dateFormatterPTBR(new Date())

  const start: any = new Date(maturity?.split('/').reverse().join('-'));
  const end: any = new Date(dateBR.split('/').reverse().join('-'));

  const difference = end - start
  const days = difference / (1000 * 60 * 60 * 24);

  return days;
}

export const getMonthPayment = ({ date, payments }: getMonthPaymentProps) => {
  const formatDate = new Date(date)
  const currentDate = `${formatDate.getFullYear()}-${formatDate.getMonth() + 1}`
  let monthPayment: paymentsProps = { id: "", saleValue: 0, paymentValue: 0 }

  for (let i = 0; i < payments.length; i++) {
    if (payments[i].id === currentDate) {
      monthPayment = payments[i]
      break
    }
  }
  return monthPayment
}

export const getNewMaturity = (date: string) => {
  const [year, month, day] = date.split(/[/-]/).map(Number);
  const currentDate = new Date(year, month - 1, day);

  const newMonth = currentDate.getMonth() + 1;
  const newYear = currentDate.getFullYear() + Math.floor(newMonth / 12);
  const monthIndex = newMonth % 12;

  const lastDayOfNewMonth = new Date(newYear, monthIndex + 1, 0).getDate();
  const safeDay = Math.min(day, lastDayOfNewMonth);

  const yyyy = newYear;
  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(safeDay).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export const getPreviousMaturity = (date: string) => {
  const [year, month, day] = date.split(/[/-]/).map(Number);

  const newMonth = month - 2;
  const newYear = year + Math.floor(newMonth / 12);
  const monthIndex = (newMonth % 12 + 12) % 12;

  const lastDayOfNewMonth = new Date(newYear, monthIndex + 1, 0).getDate();
  const safeDay = Math.min(day, lastDayOfNewMonth);

  const yyyy = newYear;
  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(safeDay).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}