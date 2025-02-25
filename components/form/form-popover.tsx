'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ElementRef, useRef } from 'react'
import { toast } from 'sonner'

import { createBoard } from '@/actions/create-board'
import { Button } from '@/components/ui/button'
import {
  Popover,
  
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { useAction } from '@/hooks/use-action'
import { useProModal } from '@/hooks/use-pro-modal'

import { FormInput } from './form-input'
import { FormPicker } from './form-picker' 
import { FormSubmit } from './form-submit'

interface FormPopoverProps {
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export const FormPopover = ({
  children,
  side = 'bottom',
  align,
  sideOffset = 0
}: FormPopoverProps) => {
  const proModal = useProModal()
  const router = useRouter()
  const closeRef = useRef<ElementRef<'button'>>(null)

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: data => {
      toast.success('Board created successfully', {
        description: 'Start adding tasks to your board now.'
      })
      closeRef.current?.click()
      router.push(`/boards/${data.id}`)
    },
    onError: error => {
      toast.error(error)
      proModal.onOpen()
    }
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    const image = formData.get('image') as string

    execute({ title, image })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className='w-80 pt-3'
      >
        <div className='text-sm font-medium text-center text-neutralForeground pb-4'>
          Create board
        </div>
        
        <form className='space-y-4' action={onSubmit}>
          <div className='space-y-4'>
            <FormPicker id='image' errors={fieldErrors} />
            <FormInput id='title' label='Board title' errors={fieldErrors} />
          </div>
          <FormSubmit className='w-full text-white'>Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}
