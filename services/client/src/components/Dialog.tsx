import {
  Dialog as DialogBase,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

type DialogProps = {
  triggerComponent: React.ReactNode
  contentComponent: React.ReactNode
  cancelComponent?: React.ReactNode
  submitComponent?: React.ReactNode
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({
  triggerComponent,
  contentComponent,
  cancelComponent,
  submitComponent,
  title,
  description,
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogBase open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {triggerComponent}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {contentComponent}
          <DialogFooter>
            <DialogClose asChild>
              {cancelComponent && cancelComponent}
            </DialogClose>
            {submitComponent && submitComponent}
          </DialogFooter>
        </DialogContent>
      </DialogBase>
  )
}
