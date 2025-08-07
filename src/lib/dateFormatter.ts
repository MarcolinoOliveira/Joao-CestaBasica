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