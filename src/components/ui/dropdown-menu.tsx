import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

export const DropdownMenu = RadixDropdown.Root
export const DropdownMenuTrigger = RadixDropdown.Trigger

export function DropdownMenuContent({ className, sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof RadixDropdown.Content>) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[160px] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      />
    </RadixDropdown.Portal>
  )
}

export function DropdownMenuItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixDropdown.Item>) {
  return (
    <RadixDropdown.Item
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-700 outline-none transition-colors',
        'hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixDropdown.Separator>) {
  return <RadixDropdown.Separator className={cn('my-1 h-px bg-gray-100', className)} {...props} />
}

export function DropdownMenuLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixDropdown.Label>) {
  return <RadixDropdown.Label className={cn('px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider', className)} {...props} />
}
