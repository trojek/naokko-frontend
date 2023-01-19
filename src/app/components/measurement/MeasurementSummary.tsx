import { Model } from "../../types"
import { useMultiSelectable } from "../../useSelectable"
import { ThreeDimensionalPreview } from "../modelPreview/ThreeDimensionalPreview"

function MeasurementSummary({ model } : { model: Model }) {
  const { selected, isSelected, toggleSelected } = useMultiSelectable({ key: 'id' })

  // console.log(model)
  return model ? (
      <ThreeDimensionalPreview {...{model, selected, isSelected, toggleSelected}} />
  ) : (<div></div>)
}

export default MeasurementSummary
