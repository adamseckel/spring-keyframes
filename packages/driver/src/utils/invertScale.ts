const maxScale = 100000
export const invertScale = (scale: number, parentScale: number = 1) =>
  scale > 0.001 ? parentScale / scale : maxScale
