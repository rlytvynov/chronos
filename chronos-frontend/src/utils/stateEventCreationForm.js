import { useCallback, useState } from "react";

export const useOpenModal = (initialState = false) => {
    const [extraData, setExtraData] = useState({})
    const [isOpen, setIsOpen] = useState(initialState)

    const handleOpen = useCallback(() => setIsOpen(true), [])
    const handleClose = useCallback(() => setIsOpen(false), [])
    const handleToogle = useCallback(() => setIsOpen(state => !state), [])
    const handleData = useCallback((arg) => setExtraData(arg), [])

    return {isOpen, extraData, handleData, handleOpen, handleClose, handleToogle}
}