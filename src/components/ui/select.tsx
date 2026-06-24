import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onValueChange: (v: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({ value, onValueChange, options, placeholder = 'Select...', className, disabled }: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <RadixSelect.Trigger
        className={cn(
          'flex h-9 items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700',
          'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'min-w-[140px] cursor-pointer',
          className
        )}
      >
        <RadixSelect.Value placeholder={<span className="text-gray-400">{placeholder}</span>} />
        <RadixSelect.Icon>
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          className="z-[200] min-w-[160px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          position="item-aligned"
          sideOffset={4}
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-3 text-sm text-gray-700 outline-none',
                  'hover:bg-primary-light hover:text-primary',
                  'data-[state=checked]:text-primary data-[state=checked]:bg-primary-light'
                )}
              >
                <RadixSelect.ItemIndicator className="absolute left-2 flex items-center">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
