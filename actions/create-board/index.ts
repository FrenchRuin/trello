'use server'

import { auth } from '@clerk/nextjs'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { CreateBoard } from './schema'
import Error from 'next/error'

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized'
		}
	}

	const { title, image } = data

	const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = image.split('|')

	console.log({ imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName })

	if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
		return {
			error: 'Missing Fields. Failed to create board.'
		}
	}

	let board

	try {
		board = await db.board.create({
			data: {
				title,
				orgId,
				imageId,
				imageFullUrl,
				imageLinkHTML,
				imageThumbUrl,
				imageUserName
			}
		})
	} catch (error) {
		return {
			error: 'Failed to create.'
		}
	}

	revalidatePath(`/board/${board.id}`)
	return {
		data: board
	}
}

export const createBoard = createSafeAction(CreateBoard, handler)
