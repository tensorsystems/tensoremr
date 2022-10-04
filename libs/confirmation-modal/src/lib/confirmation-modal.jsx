import {
  createContext, useCallback, useContext, useRef, useState
} from "react"
import { Modal } from '@tensoremr/ui-components';

const ConfirmDialog = createContext()

export function ConfirmDialogProvider({ children }) {
  const [modalState, setModalState] = useState({ isOpen: false })
  const fn = useRef()

  const confirm = useCallback((data) => { 
    return new Promise((resolve) => {
      setModalState({ ...data, isOpen: true })
      fn.current = (choice) => { 
        resolve(choice) 
        setModalState({ isOpen: false })
      }
      setModalState({ isOpen: false })
    })
  }, [setModalState])   

  return (
    <ConfirmDialog.Provider value={confirm}>
      {children}
      <Modal
        {...modalState}
        
        onClose={() => fn.current(false)}   
        onConfirm={() => fn.current(true)}  
      />
    </ConfirmDialog.Provider>
  )
}

export default function useConfirm() {
  return useContext(ConfirmDialog)
}