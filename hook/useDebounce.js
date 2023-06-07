import { useEffect, useState } from "react";
// import { clearTimeout } from "timers";

export default function useDebounce (value, delay, setPage=() => {}) {
    const [debounceValue, setDebounceValue] = useState(value)
    useEffect(()=> {
        // setTimeout fungsi yang berjalan terus
        const interval = setTimeout(() => {
            setDebounceValue(value)
            setPage(1)
        }, delay);

        return () => clearTimeout(interval)
    }, [value, delay])

    return debounceValue
}