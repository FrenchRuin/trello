'use client'

import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import { ListWithCards } from '@/type'
import { ListForm } from './list-form'
import { ListItem } from './list-item'
import { useAction } from '@/hooks/use-action'
import { updateListOrder } from '@/actions/update-list-order'
import { updateCardOrder } from '@/actions/update-card-order'
import { toast } from 'sonner'

interface ListContainerProps {
	data: ListWithCards[]
	boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)
	return result
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
	const [orderedData, setOrderedData] = useState(data)

	const { excute: excuteUpdateListOrder } = useAction(updateListOrder, {
		onSuccess: () => {
			toast.success('List reorderd')
		},
		onError: (error) => {
			toast.error(error)
		}
	})

	const { excute: excuteUpdateCardOrder } = useAction(updateCardOrder, {
		onSuccess: () => {
			toast.success('Card reorderd')
		},
		onError: (error) => {
			toast.error(error)
		}
	})

	useEffect(() => {
		setOrderedData(data)
	}, [data])

	const onDragEnd = (result: any) => {
		const { destination, source, type } = result

		if (!destination) {
			return
		}

		// if dropped in the same position
		if (destination.droppableId == source.droppableId && destination.index == source.index) {
			return
		}

		// User moves a list
		if (type === 'list') {
			const items = reorder(orderedData, source.index, destination.index).map((item, index) => ({
				...item,
				order: index
			}))

			setOrderedData(items)
			excuteUpdateListOrder({ items, boardId })
		}

		// User moves a card
		if (type === 'card') {
			let newOrderData = [...orderedData]

			const sourceList = newOrderData.find((list) => list.id === source.droppableId)
			const destList = newOrderData.find((list) => list.id === destination.droppableId)

			if (!sourceList || !destList) {
				return
			}

			// check if cards exists on the source list
			if (!sourceList.cards) {
				sourceList.cards = []
			}

			if (!destList.cards) {
				destList.cards = []
			}

			if (source.droppableId === destination.droppableId) {
				const reorderedCards = reorder(sourceList.cards, source.index, destination.index)

				reorderedCards.forEach((card, index) => {
					card.order = index
				})

				sourceList.cards = reorderedCards

				setOrderedData(newOrderData)
				excuteUpdateCardOrder({ items: reorderedCards, boardId: boardId })
			} else {
				// remove card from source list
				const [moveCard] = sourceList.cards.splice(source.index, 1)

				// Assign to destination list
				moveCard.listId = destination.droppableId

				// Add card to the destination list
				destList.cards.splice(destination.index, 0, moveCard)

				sourceList.cards.forEach((card, index) => {
					card.order = index
				})

				// update the order for each card in the destination list
				destList.cards.forEach((card, index) => {
					card.order = index
				})

				setOrderedData(newOrderData)
				excuteUpdateCardOrder({ items: destList.cards, boardId: boardId })
			}
		}
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="lists" type="list" direction="horizontal">
				{(provided) => (
					<ol {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full">
						{orderedData.map((list, index) => {
							return <ListItem key={list.id} index={index} data={list} />
						})}
						{provided.placeholder}
						<ListForm />
						<div className="flex-shrink-0 w-1" />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	)
}
