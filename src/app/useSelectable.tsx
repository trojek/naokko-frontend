import { useState } from 'react'

function useSelectable({ key, preSelected }: any) {
  const [selected, setSelected] = useState(preSelected)

  const isSelected = (item: any) => {
    return selected?.[key] === item[key]
  }

  const toggleSelected = (item: any) => {
    if (isSelected(item)) {
      setSelected(undefined)
    } else {
      setSelected(item)
    }
  }

  const clearSelected = () => setSelected(undefined)

  return {
    selected,
    isSelected,
    toggleSelected,
    clearSelected,
  }
}

function useMultiSelectable({ key, preSelected }: any) {
  const [selected, setSelected] = useState(preSelected ?? [])

  const toggleSelected = (item: any) => {
    const exists = selected.find((_: any) => _[key] === item[key])
    if (exists) {
      setSelected(selected.filter((_: any) => _[key] !== item[key]))
    } else {
      setSelected([...selected, item])
    }
  }

  const isSelected = (item: any) => {
    return selected.findIndex((_: any) => _[key] === item[key]) > -1
  }

  const clearSelected = () => setSelected([])

  return {
    selected,
    isSelected,
    toggleSelected,
    clearSelected,
  }
}

export { useSelectable, useMultiSelectable }
