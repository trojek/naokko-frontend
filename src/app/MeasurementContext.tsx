import {createContext, FunctionComponent, useContext, useEffect, useState} from "react";
import {emptyTriggerQueryState, TriggerQueryState, useApiWithTrigger} from "./api/hook";
import {AppContext} from "./AppContext";
import {ModelDto, ModelWrapperDto} from "./api/register";
import {Model, Element} from "./types";

interface MeasurementState {
    model: Model
    queryLeft: TriggerQueryState<ModelDto>
    queryRight: TriggerQueryState<ModelDto>
    measured: boolean
    inProgress: boolean
    waitingForNext: boolean
    cancel: () => void
    trigger: () => void
    triggerNext: () => void
    finalized: boolean;
    finalize: (data: ModelDto) => void;
}

export interface MeasurementContextInterface {
    index: string
    measurement: MeasurementState
    selectedElement: Element | "size" | null
    setSelectedElement: (_: Element | "size" | null) => void
}

const emptyMeasurementState = {
    model: new Model(),
    queryLeft: emptyTriggerQueryState,
    queryRight: emptyTriggerQueryState,
    measured: false,
    inProgress: false,
    waitingForNext: false,
    cancel: () => {},
    trigger: () => {},
    triggerNext: () => {},
    finalized: false,
    finalize: (data: ModelDto) => null,
}

const measurementContextDefaults: MeasurementContextInterface = {
    index: '',
    measurement: emptyMeasurementState,
    selectedElement: null,
    setSelectedElement: (_: Element | "size" | null) => {},
}

export const MeasurementContext = createContext<MeasurementContextInterface>(measurementContextDefaults)

interface MeasurementContextProviderProps {
    index: string,
    model: ModelWrapperDto
}

function useMeasurementState(wrapperDto: ModelWrapperDto) {
    const {measurementClient} = useContext(AppContext)
    const [model, setModel] = useState<Model>(Model.fromDto(wrapperDto.new))
    const [inProgress, setInProgress] = useState<boolean>(false)
    const [measured, setMeasured] = useState<boolean>(false)
    const queryLeft = useApiWithTrigger(() => measurementClient.measureLeft(wrapperDto.old))
    const queryRight = useApiWithTrigger(() => measurementClient.measureRight(wrapperDto.old))
    const [finalized, setFinalized] = useState(false);

    const isLoading = (queryLeft.isLoading || queryRight.isLoading) && !finalized

    const isError = (queryLeft.isError || queryRight.isError)

    const waitingForNext = queryLeft.isSuccess && !queryRight.data && !isLoading && !isError && !finalized

    useEffect(() => {
        setModel(Model.fromDto(wrapperDto.new))
        setMeasured(false)
    }, [wrapperDto])

    useEffect(() => {
        if(!!queryRight.data) {
            setMeasured(true)
            setModel(m => m.withMeasurement(queryRight.data!))
        }
    }, [queryRight.data])

    useEffect(() => {
        if(inProgress) {
            setInProgress((!queryLeft.isSuccess || !queryRight.data) && !isError)
        }
    }, [inProgress, isError, queryLeft.data, queryLeft.isSuccess, queryRight.data])

    const trigger = () => {
        queryLeft.clear()
        queryRight.clear()
        setInProgress(true)
        setMeasured(false)
        setFinalized(false)
        queryLeft.trigger()
    }

    const triggerNext = () => {
        queryRight.trigger()
    }

    const cancel = () => {
        queryLeft.clear()
        queryRight.clear()
        setInProgress(false)
    }

    const finalize = (data: ModelDto) => {
        console.log("finalize")

        setInProgress(false)
        setMeasured(true)
        setFinalized(true)
        setModel(m => m.withMeasurement(data))
    }

    return {
        model,
        queryLeft,
        queryRight,
        inProgress,
        trigger,
        triggerNext,
        waitingForNext,
        cancel,
        measured,
        finalize,
        finalized,
    }
}

export const MeasurementContextProvider: FunctionComponent<MeasurementContextProviderProps> = (props) => {
    const {children, index} = props
    const measurement = useMeasurementState(props.model)
    const [selectedElement, setSelectedElement] = useState<Element | "size" | null>(null)

    const toggleSelectedElement = (id: Element | "size" | null) => {
        setSelectedElement(id)
    }

    useEffect(() => {
        setSelectedElement("size")
    }, [index])

    return (
        <MeasurementContext.Provider value={{
            ...measurementContextDefaults,
            index, measurement, selectedElement, setSelectedElement : toggleSelectedElement,
        }}>
            {children}
        </MeasurementContext.Provider>
    )
}
