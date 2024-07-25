"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"

interface ConfirmModelProps {
    children: React.ReactNode;
    onConfirm: () => void;
}

export const ConfirmModel = ({
    children,
    onConfirm
}: ConfirmModelProps) => {
    return (
        <div>
            <AlertDialog>
              <AlertDialogTrigger>
                {children}
              </AlertDialogTrigger>
           <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you  sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  The action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
    )
}