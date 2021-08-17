import { SomeActionType } from '@/contexts/app/app.type'

export enum ActionType {
  SOME_ACTION = '@APP/SOME_ACTION',
}

export const someAction = (payload: SomeActionType) => ({
  type: ActionType.SOME_ACTION,
  payload,
})
