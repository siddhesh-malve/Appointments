import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sheet = RadixDialog.Root
export const SheetTrigger = RadixDialog.Trigger
export const SheetClose = RadixDialog.Close

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  width?: string
}

export function SheetContent({ className, children, width = 'w-[500px]', ...props }: SheetContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-[100] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <RadixDialog.Content
        className={cn(
          'fixed right-0 top-0 z-[100] h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
          'duration-300',
          width,
          className
        )}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0', className)} {...props} />
  )
}

export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-y-auto px-6 py-5', className)} {...props} />
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-shrink-0 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50', className)} {...props} />
  )
}

export function SheetTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixDialog.Title>) {
  return <RadixDialog.Title className={cn('text-base font-semibold text-gray-900', className)} {...props} />
}

export function SheetCloseButton() {
  return (
    <RadixDialog.Close className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
      <X className="h-4 w-4" />
    </RadixDialog.Close>
  )
}
