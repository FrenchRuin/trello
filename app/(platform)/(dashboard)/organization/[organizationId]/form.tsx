'use client'

import { createBoard } from '@/actions/create-board'
import { FormInput } from './form-input'
import { FormButton } from './form-buttion'
import { useAction } from '@/hooks/use-action'

export const Form = () => {
	const { excute, fieldErrors } = useAction(createBoard, {
		onSuccess: (data) => {
			console.log(data, 'success')
		},
		onError: (error) => {
			console.error(error)
		}
	})

	const onSubmit = (forData: FormData) => {
		const title = forData.get('title') as string

		excute({ title })
	}

	return (
		<form action={onSubmit}>
			<div className="flex flex-col space-y-2">
				<FormInput errors={fieldErrors} />
			</div>
			<FormButton />
		</form>
	)
}
