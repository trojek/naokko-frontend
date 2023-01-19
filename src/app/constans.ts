export const directions = ['top', 'left', 'front', 'bottom', 'right', 'rear'] as const
export const views = ['3d', ...directions] as const
export const viewNames = ['3d', 'górna', 'lewa', 'przednia', 'dolna', 'prawa', 'tylna'] as const
