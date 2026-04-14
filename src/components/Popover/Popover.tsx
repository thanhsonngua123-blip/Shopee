import { useState } from 'react'
import {
  autoUpdate,
  offset,
  shift,
  useFloating,
  flip,
  useHover,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal
} from '@floating-ui/react'

interface PopoverProps {
  children: React.ReactNode
  renderPopover: React.ReactNode
  offsetValue?: number
}

export default function Popover({ children, renderPopover, offsetValue = 8 }: PopoverProps) {
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(offsetValue), flip(), shift({ padding: 8 })]
  })

  const hover = useHover(context, { move: false, delay: { open: 80, close: 120 } })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss, role])

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

      {open && (
        <FloatingPortal>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className='bg-white shadow-md rounded-sm z-50'
          >
            {renderPopover}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
