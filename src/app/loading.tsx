import { LoaderCircle } from "lucide-react";

const loading = () => {

  return (
    <div className="flex items-center w-full h-[80vh] justify-center gap-2">
      <LoaderCircle />
      <p>Carregando...</p>
    </div>
  );
}

export default loading;