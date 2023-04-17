export const directions = ['top', 'left', 'front', 'bottom', 'right', 'rear'] as const
export const directionsNames = ['góra', 'lewo', 'przód', 'dół', 'prawo', 'tył']
export const views = ['3d', ...directions] as const
export const viewNames = ['3d', ...directionsNames] as const
export const bases = [
  [0, 0, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0],
  [0, 0, 1, 1],
  [0, 1, 0, 0],
  [0, 1, 0, 1],
  [0, 1, 1, 0],
  [0, 1, 1, 1],
  [1, 0, 0, 0],
  [1, 0, 0, 1],
  [1, 0, 1, 0],
  [1, 0, 1, 1],
  [1, 1, 0, 0],
  [1, 1, 0, 1],
  [1, 1, 1, 0],
  [1, 1, 1, 1],
]