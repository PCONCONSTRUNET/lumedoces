import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmOptions = { title: string; description?: string };
type ConfirmContextType = (title: string, description?: string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
  const [options, setOptions] = useState<ConfirmOptions>({ title: "" });

  const confirm = useCallback((title: string, description?: string) => {
    return new Promise<boolean>((resolve) => {
      setOptions({ title, description });
      setPromise({ resolve });
    });
  }, []);

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={promise !== null} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            {options.description && (
              <AlertDialogDescription>{options.description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm} 
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm deve ser usado dentro de um ConfirmProvider");
  }
  return { confirm: context };
}
