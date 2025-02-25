'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'

import { UpdateCardOrderSchema } from './schema'
import { InputType, ReturnType } from './type'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized!'
    }
  }

  const { items, boardId } = data

  let updatedCards

  try {
    const transaction = items.map(card =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId
            }
          }
        },
        data: {
          order: card.order,
          listId: card.listId
        }
      })
    )

    updatedCards = await db.$transaction(transaction)
  } catch (error) {
    return {
      error: 'Failed to update card order!'
    }
  }

  revalidatePath(`/boards/${boardId}`)
  return { data: updatedCards }
}

export const updateCardOrder = createSafeAction(UpdateCardOrderSchema, handler)
