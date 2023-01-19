import {createContext, FunctionComponent, useEffect, useMemo, useState} from "react";
import {
    DummyHardCodedRegisterClient,
    ModelWrapperDto,
    RegisterClient,
} from "./api/register";
import {emptyQueryState, QueryState, useApi} from "./api/hook";
import {HttpMeasurementClient, MeasurementClient} from "./api/measurements";

interface AppContextInterface {
    selectedIndex?: string
    setSelectedIndex: (s: string) => void
    modelQuery: QueryState<ModelWrapperDto>
    registerClient: RegisterClient
    measurementClient: MeasurementClient
    communicationError: boolean
    setCommunicationError: () => void
}

const appContextDefaults: AppContextInterface = {
    setSelectedIndex: () => {},
    modelQuery: emptyQueryState,
    registerClient: new DummyHardCodedRegisterClient(),
    measurementClient: new HttpMeasurementClient(),
    communicationError: false,
    setCommunicationError: () => {},
}

export const AppContext = createContext<AppContextInterface>(appContextDefaults)

export const AppContextProvider: FunctionComponent = ({children}) => {
    const {registerClient} = appContextDefaults
    const [selectedIndex, setSelectedIndex] = useState<string>()
    const query = useMemo(() => (!!selectedIndex ? registerClient.getModel(selectedIndex) : undefined), [selectedIndex])
    const modelQuery = useApi<ModelWrapperDto>(query, [selectedIndex])

    const [error, setError] = useState(false)

    useEffect(() => {
        if(error) {
            const timeout = setTimeout(() => setError(false), 5000)
            return () => clearTimeout(timeout)
        }
    }, [error])

    return (
        <AppContext.Provider value={{
            ...appContextDefaults,
            selectedIndex,
            setSelectedIndex,
            modelQuery,
            communicationError: error,
            setCommunicationError: () => setError(true),
        }}>
            {children}
        </AppContext.Provider>
    )
}
