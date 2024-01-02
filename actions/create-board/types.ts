import { z } from 'zod'
import { Board } from '@prisma/client'
import { ActionState } from '@/lib/create-safe-action'
import { CreateBoard } from './schema'

export type InputType = z.infer<typeof CreateBoard> // Zod Schema를 통해서 Type을 추론한다.
export type ReturnType = ActionState<InputType, Board>
