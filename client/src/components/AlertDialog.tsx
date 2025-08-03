"use client"

import {
  AlertDialog as AlertDialogBase,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type AlertDialogState = {
  open: boolean;
  title: string;
  description: string;
  approveText: string;
  onApprove: () => void;
} & ({
  onCancel: () => void;
  cancelText: string;
} | {
  onCancel?: undefined;
  cancelText?: string;
})

export const INITIAL_ALERT_DIALOG_STATE: AlertDialogState = {
  open: false,
  title: '',
  description: '',
  approveText: '',
  onApprove: () => {},
  onCancel: undefined,
  cancelText: undefined
};

type AlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  approveText?: string
  onApprove: () => void
  variant?: "default" | "destructive"
  onCancel?: () => void
  cancelText?: string
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  approveText = "Approve",
  cancelText = "Cancel",
  onApprove,
  onCancel,
  variant = "default",
}: AlertDialogProps) {
  const handleApprove = () => {
    onApprove()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <AlertDialogBase open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onCancel && <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>}
          <AlertDialogAction
            onClick={handleApprove}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {approveText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogBase>
  )
}
