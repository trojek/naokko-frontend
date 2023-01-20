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

  const selectAll = (items: any[]) => {
    const selectedKeys = selected.map((__: any) => __[key])
    const newItems = items.filter(_ => !selectedKeys.includes(_[key]))
    const newSelected = [
      ...selected,
      ...newItems
    ]
    setSelected(newSelected)
  }

  const deselectAll = (items: any[]) => {
    const itemsKeys = items.map((_: any) => _[key])
    setSelected(selected.filter((_: any) => !itemsKeys.includes(_[key])))
  }

  const isSelected = (item: any) => {
    return selected.findIndex((_: any) => _[key] === item[key]) > -1
  }

  const clearSelected = () => setSelected([])

  return {
    selected,
    isSelected,
    setSelected,
    toggleSelected,
    selectAll,
    deselectAll,
    clearSelected,
  }
}

export { useSelectable, useMultiSelectable }
