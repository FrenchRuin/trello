'use client'

import { createBoard } from '@/actions/create-board'

import { useAction } from '@/hooks/use-action'
import { FormInput } from '@/components/form/form-input'
import { FormSubmit } from '@/components/form/form-submit'

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

		console.log({ title })

		excute({ title })
	}

	return (
		<form action={onSubmit}>
			<div className="flex flex-col space-y-2">
				<FormInput id="title" errors={fieldErrors} label="Board Title" />
			</div>
			<FormSubmit>Save</FormSubmit>
		</form>
	)
}
