import { z } from 'zod'

// Zod 를 사용하여 Schema 구조 생성
// 최소 글자와, string을 사용
export const CreateBoard = z.object({
	title: z
		.string({
			required_error: 'Title is required',
			invalid_type_error: 'Title is required'
		})
		.min(3, {
			message: 'Title is too short.'
		}),
	image: z.string({
		required_error: 'Image is required',
		invalid_type_error: 'Image is required'
	})
})
