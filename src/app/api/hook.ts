import {DependencyList, useContext, useEffect, useState} from "react";
import {AppContext} from "../AppContext";

export interface QueryState<T> {
    data?: T,
    isError: boolean,
    isLoading: boolean,
}

export const emptyQueryState: QueryState<any> = {
    isError: false,
    isLoading: false
}

export function useApi<T>(query: Promise<T> | undefined, deps: DependencyList = []): QueryState<T> {
    const [data, setData] = useState<T>()
    const [isError, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const {setCommunicationError} = useContext(AppContext)

    useEffect(() => {
        const f = async () => {
            if (!!query) {
                setLoading(true)
                setError(false)
                setData(undefined)

                try {
                    setData(await query)
                } catch {
                    setCommunicationError()
                    setError(true)
                } finally {
                    setLoading(false)
                }
            }
        }

        f()
    }, [deps])

    return {data, isError, isLoading}
}

export interface TriggerQueryState<T> {
    data: T | null,
    isSuccess: boolean,
    isError: boolean,
    isLoading: boolean,
    trigger: () => void,
    clear: () => void,
}

export const emptyTriggerQueryState: TriggerQueryState<any> = {
    data: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    trigger: () => {},
    clear: () => {}
}

export function useApiWithTrigger<T>(query: () => Promise<T>): TriggerQueryState<T> {
    const [data, setData] = useState<T | null>(null)
    const [isError, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const {setCommunicationError} = useContext(AppContext)

    const trigger = async () => {
        if (!isLoading) {
            setLoading(true)
            setError(false)
            setData(null)

            try {
                setData(await query())
                setSuccess(true)
            } catch(e) {
                console.log(e)
                setCommunicationError()
                setError(true)
            } finally {
                setLoading(false)
            }
        }
    }

    const clear = () => {
        setData(null)
        setError(false)
        setLoading(false)
        setSuccess(false)
    }

    return {data, isSuccess, isError, isLoading, trigger, clear}
}
