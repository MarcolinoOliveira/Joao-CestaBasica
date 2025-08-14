'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { updateUserMaturity } from "@/firebase/updateDocs";
import { toast } from "sonner";

interface editMaturityProps {
  id: string
  maturity: Partial<string>
  openEditMaturity: boolean
  setOpenEditMaturity: Dispatch<SetStateAction<boolean>>
}

const EditMaturity = ({ id, maturity, openEditMaturity, setOpenEditMaturity }: editMaturityProps) => {

  const [newMaturity, setNewMaturity] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setNewMaturity(maturity)
  }, [])

  const handleSaveNewMaturity = async () => {
    if (!newMaturity) {
      toast.error('Preencha o vencimento', { richColors: true })
      return
    }
    setLoading(true)
    await updateUserMaturity({ id, newMaturity })
    setLoading(false)
    toast.success('Vencimento alterado com sucesso', { richColors: true })
    setOpenEditMaturity(prev => !prev)
  }

  return (
    <Dialog open={openEditMaturity} onOpenChange={() => setOpenEditMaturity(prev => !prev)}>
      <DialogContent className="w-[340px] sm:w-[400px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Vencimento</DialogTitle>
        </DialogHeader>
        <div className="grid w-full gap-2">
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="name" className="text-left w-full font-semibold">
              Vencimento*:
            </Label>
            <Input
              id="data"
              type="date"
              value={newMaturity ?? ''}
              onChange={(e) => setNewMaturity(e.target.value)}
              min="1900-01-01"
              max="2299-12-31"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveNewMaturity} className="w-full cursor-pointer">
            {!loading ? "Salvar" : <LoaderCircle className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditMaturity;