import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue?: T) {
    const [storedValue, setStoredValue] = useState<T | undefined>(initialValue)

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key)
            if (item) setStoredValue(JSON.parse(item) as T)
        } catch {
            // ignore
        }
    }, [key])

    const setValue = (
        value: T | undefined | ((val: T | undefined) => T | undefined),
    ) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            if (valueToStore === undefined) {
                window.localStorage.removeItem(key)
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.error(`Error saving to localStorage [${key}]:`, error)
        }
    }

    return [storedValue, setValue] as const
}
