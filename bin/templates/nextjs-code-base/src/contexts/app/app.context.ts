import React from 'react'

import { initialState } from '@/contexts/app/app.reducer'
import { AppActionType, AppStateType } from '@/contexts/app/app.type'

type ContextType = {
  state: AppStateType
  dispatch: React.Dispatch<AppActionType>
}

export const AppContext = React.createContext<ContextType>({
  state: initialState,
  dispatch: () => {},
})

export const useAppContext = () => React.useContext(AppContext)
