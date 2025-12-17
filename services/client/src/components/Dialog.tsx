import {
  Dialog as DialogBase,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

type DialogProps = {
  triggerComponent: React.ReactNode
  contentComponent: React.ReactNode
  cancelComponent?: React.ReactNode
  submitComponent?: React.ReactNode
}

export function Dialog({
  triggerComponent,
  contentComponent,
  cancelComponent,
  submitComponent,
}: DialogProps) {
  return (
    <DialogBase>
      <DialogTrigger asChild>
        {triggerComponent}
      </DialogTrigger>
      <DialogContent>
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
