'use client'

import ClientsContext from "@/context/ClientsContext";
import { paymentsProps } from "@/interfaces/interfaces";
import { filterPaymentByMonth, formatCurrentMonth, getCurrentMonth } from "@/lib/dateFormatter";
import { SquareArrowLeft, SquareArrowRight } from "lucide-react";
import { use, useEffect, useState } from "react";

const Dashboard = () => {

  const { payments } = use(ClientsContext)

  const sequencePayments = payments?.sort((a, b) => {
    const [anoA, numA] = a.id.split("-").map(Number);
    const [anoB, numB] = b.id.split("-").map(Number);

    if (anoA !== anoB) return anoB - anoA;
    return numB - numA;
  });

  const historicalSales = payments.reduce((acc, curr) => acc + curr.saleValue, 0)
  const historicalPayments = payments.reduce((acc, curr) => acc + curr.paymentValue, 0)

  return (
    <div className="flex flex-col mx-auto max-w-5xl gap-3">
      <div className="flex items-center justify-center text-2xl font-bold w-full">
        <p>Todas as vendas</p>
      </div>
      <div className="flex flex-col border border-card rounded-2xl">
        <div className="grid grid-cols-3 p-2 bg-card font-bold rounded-t-2xl">
          <p className="flex items-center justify-start">Total</p>
          <p className="flex items-center justify-center">Vendido</p>
          <p className="flex items-center justify-end pr-3">Recebido</p>
        </div>
        <div>
          <div className="grid grid-cols-3 px-2 py-4 font-semibold border-b border-card last:rounded-2xl">
            <p className="flex justify-start items-center">Todos os mêses</p>
            <p className="flex justify-center items-center">{historicalSales?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p className="flex justify-end items-center pr-3 text-green-600">{historicalPayments?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center text-2xl font-bold w-full mt-5">
        <p>Vendas de cada mês</p>
      </div>
      <div className="flex flex-col border border-card rounded-2xl">
        <div className="grid grid-cols-3 p-2 bg-card font-bold rounded-t-2xl">
          <p className="flex items-center justify-start">Vendas</p>
          <p className="flex items-center justify-center">Vendido</p>
          <p className="flex items-center justify-end pr-3">Recebido</p>
        </div>
        {sequencePayments.map((e, i) => (
          <div key={i} className="grid grid-cols-3 px-2 py-4 font-semibold border-b border-card last:rounded-2xl">
            <p className="flex justify-start items-center">{formatCurrentMonth(e.id)}</p>
            <p className="flex justify-center items-center">{e.saleValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p className="flex justify-end items-center pr-3 text-green-600">{e.paymentValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;