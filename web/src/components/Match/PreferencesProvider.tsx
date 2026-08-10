"use client"

import { createContext, ReactNode, useContext, useState } from "react";
import { Color } from "../../lib/Chess/types";

export { PreferencesProvider, usePreferences };

interface PreferencesContext {
    orientation: Color,
    toggleOrientation: () => void,
}
const PreferencesContext = createContext<PreferencesContext|null>(null)

const PreferencesProvider = ({children}: {children: ReactNode}) => {
    // todo other default orientation
    const [orientation, setOrientation] = useState<Color>(Color.White)

    const toggleOrientation = () => {
        if (orientation === Color.White) {
            return setOrientation(Color.Black)
        }

        return setOrientation(Color.White)
    }

    

    return (
        <PreferencesContext.Provider value={{orientation, toggleOrientation}}>
            {children}
        </PreferencesContext.Provider>
    )
}

const usePreferences = () => {
    const ctx = useContext(PreferencesContext)
    if (!ctx) throw new Error("can only access interaction context within its provider")
    return ctx
}