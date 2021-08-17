import { AppActionType, AppStateType } from '@/contexts/app/app.type'
import { ActionType } from '@/contexts/app/app.action'

export const initialState: AppStateType = {
  name: 'Hieu Nguyen',
}

export const AppReducer = (state: AppStateType, action: AppActionType) => {
  switch (action.type) {
    case ActionType.SOME_ACTION:
      return { ...state, ...action.payload }

    default:
      return state
  }
}
