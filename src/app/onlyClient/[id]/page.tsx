import ClientFinance from "@/components/client/ClientFinance"

interface onlyClientProps {
  params: Promise<{ id: any }>
}

export default async function onlyClient({ params }: onlyClientProps) {

  const id = (await params).id

  return (
    <div>
      <ClientFinance id={id} />
    </div>
  )
}