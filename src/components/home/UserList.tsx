'use client'

import ClientsContext from "@/context/ClientsContext";
import { clientProps } from "@/interfaces/interfaces";
import { CSSProperties, use, useState } from "react";
import CreateUser from "../global/CreateUser";
import { Button } from "../ui/button";
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList } from "react-window"
import Link from "next/link";
import { Input } from "../ui/input";
import { PencilLine, Search } from "lucide-react";
import HeaderUser from "./HeaderUser";
import MenuClientsStatus from "./MenuClientsStatus";
import { getAllClientsDesabled } from "@/firebase/getDocs";

interface rowListUsersProps {
  index: number,
  style: CSSProperties
}

const UserList = () => {

  const [open, setOpen] = useState(false)
  const [editUser, setEditUser] = useState<Partial<clientProps>>({})
  const [statusClient, setStatusClient] = useState<string>("active")
  const [search, setSearch] = useState<string>("")
  const [clientsInactive, setClientsInactive] = useState<clientProps[]>([])

  const { clients } = use(ClientsContext)

  const searchClientsAtivos = clients?.filter(client => client.name.toLowerCase().includes(search.toLowerCase())
    || client.status?.toLowerCase().includes(search.toLowerCase()) || client.city.toLowerCase().includes(search.toLowerCase())
    || client.neighborhood.toLowerCase().includes(search.toLowerCase()) || client.street.toLowerCase().includes(search.toLowerCase())
    || client.maturity.toLowerCase().includes(search.toLowerCase()) || client.date?.toLowerCase().includes(search.toLowerCase()))

  const searchClientsInativos = clientsInactive?.filter(client => client.name.toLowerCase().includes(search.toLowerCase())
    || client.status?.toLowerCase().includes(search.toLowerCase()) || client.city.toLowerCase().includes(search.toLowerCase())
    || client.neighborhood.toLowerCase().includes(search.toLowerCase()) || client.street.toLowerCase().includes(search.toLowerCase())
    || client.maturity.toLowerCase().includes(search.toLowerCase()) || client.date?.toLowerCase().includes(search.toLowerCase()))

  const clientsInactives = () => {
    getAllClientsDesabled({ setClientsInactive })
    setStatusClient("desabled")
  }

  const handleUser = (user: Partial<clientProps>) => {
    setEditUser(user)
    setOpen(prev => !prev)
  }

  const rowListUsers = ({ index, style }: rowListUsersProps) => {

    const e = statusClient === 'active' ? searchClientsAtivos[index] : searchClientsInativos[index]

    return (
      <div key={index} style={style} className={`grid grid-cols-18 w-full gap-1 font-semibold rounded-md border-b pl-2 pr-4 border-border ${index % 2 === 0 ? 'bg-border' : 'bg-accent'}`}>
        <div className="col-span-4 flex flex-col items-start justify-start my-auto">
          <Link href={`onlyClient/${e.id}`} className="hover:underline">{e.name}</Link>
          <div className=" flex gap-4">
            <p>{e.phone}</p>
            <p>{e.date?.split('-').reverse().join('/')}</p>
          </div>
        </div>
        <div className="col-span-3 flex items-center justify-center" >
          <p>{e.street}</p>
        </div>
        <div className="flex items-center justify-center">
          <p>{e.number}</p>
        </div>
        <div className="col-span-2 flex items-center justify-center ">
          <p>{e.neighborhood}</p>
        </div>
        <div className="col-span-2 flex items-center justify-center ">
          <p>{e.city}</p>
        </div>
        <div className="col-span-2 flex items-center justify-center ">
          <p>{e.reference}</p>
        </div>
        <div className="col-span-2 flex items-center justify-center ">
          <p>{e.maturity?.split('-').reverse().join('/')}</p>
        </div>
        <div className={`flex items-center justify-center rounded-3xl h-6 my-auto ${e.status === "OK" ? 'bg-green-500' : 'bg-red-500'}`}>
          <p>{e.status}</p>
        </div>
        <div className="flex items-center justify-end ">
          <PencilLine size={20} onClick={() => handleUser(e)} className="cursor-pointer mr-3 hover:text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 h-[72vh]">
      <div className="flex w-full justify-between">
        <MenuClientsStatus statusClient={statusClient} setStatusClient={setStatusClient} clientsInactives={clientsInactives} />
        <Button className="cursor-pointer" onClick={() => handleUser({})}>Novo cliente</Button>
      </div>
      <div className="relative items-center py-2 w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2 pointer-events-none" />
        <Input placeholder="Pesquisar..." className="w-full pl-10" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="w-full">
        <HeaderUser searchClients={statusClient === 'active' ? searchClientsAtivos.length : searchClientsInativos.length}
        />
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={statusClient === 'active' ? searchClientsAtivos.length : searchClientsInativos.length}
            itemSize={65}
            className="custom-scrollbar"
          >
            {rowListUsers}
          </FixedSizeList>
        )}
      </AutoSizer>
      <CreateUser client={editUser} open={open} setOpen={setOpen} />
    </div>
  );
}

export default UserList;