"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { use, useEffect } from "react"
import ClientsContext from "@/context/ClientsContext"
import { getAllClients, getMonthsPayments } from "@/firebase/getDocs"


export default function TopBar() {

  const { setTheme, theme } = useTheme()
  const { setClients, setPayments } = use(ClientsContext)

  useEffect(() => {
    getAllClients({ setClients })
    getMonthsPayments({ setPayments })
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 py-1.5 px-4 max-w-[2000px] mx-auto">
      <Link href={'/'} className="flex justify-start items-center cursor-pointer font-bold text-2xl text-primary italic">
        João Silva
      </Link>
      <p className="hidden lg:flex justify-center items-center font-bold text-2xl">Controle de vendas Cestas básicas</p>
      <div className="flex justify-end items-center">
        <Button variant="outline" size="icon" onClick={toggleTheme} className="cursor-pointer">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </div>
    </div>
  )
}
