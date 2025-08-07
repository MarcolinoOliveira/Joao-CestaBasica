'use client'

interface HeaderUserProps {
  searchClients: number
}

const HeaderUser = ({ searchClients }: HeaderUserProps) => {

  return (
    <div className="grid grid-cols-18 w-full gap-1 font-semibold rounded-md bg-primary p-2 text-primary-foreground pr-7">
      <div className="col-span-4 flex flex-col items-start justify-start">
        Nome/Telefone
      </div>
      <div className="col-span-3 flex items-center justify-center" >
        <p>Rua</p>
      </div>
      <div className="flex items-center justify-center">
        <p>Nº</p>
      </div>
      <div className="col-span-2 flex items-center justify-center ">
        <p>Bairro</p>
      </div>
      <div className="col-span-2 flex items-center justify-center ">
        <p>Cidade</p>
      </div>
      <div className="col-span-2 flex items-center justify-center ">
        <p>Referência</p>
      </div>
      <div className="col-span-2 flex items-center justify-center ">
        <p>Vencimento</p>
      </div>
      <div className="flex items-center  justify-center rounded-3xl">
        <p>Status</p>
      </div>
      <div className="flex items-center justify-end ">
        <p>Total: {searchClients}</p>
      </div>
    </div>
  );
}

export default HeaderUser;