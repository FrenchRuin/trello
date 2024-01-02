import { deleteBoard } from '@/actions/delete-board'
import { FormDelete } from './form-delete'

interface BoardProps {
	title: string
	id: string
}

export const Board = ({ title, id }: BoardProps) => {
	const deleteBoardId = deleteBoard.bind(null, id)
	return (
		<form action={deleteBoardId} className="flex items-center gap-x-2">
			<p>Board Title : {title}</p>
			<FormDelete />
		</form>
	)
}
