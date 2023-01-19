import useModels from "../../hooks/useModels"
import { useMultiSelectable } from "../../useSelectable"
import { ThreeDimensionalPreview } from "../modelPreview/ThreeDimensionalPreview"

function Preview({ modelId } : { modelId: string}) {
  const { getModel } = useModels()
  const { selected, isSelected, toggleSelected } = useMultiSelectable({ key: 'id' })

  const model = getModel(modelId)
  // console.log(model)
  return model?.json ? (
      <ThreeDimensionalPreview {...{model, selected, isSelected, toggleSelected}} />
  ) : (<div></div>)
}

export default Preview
