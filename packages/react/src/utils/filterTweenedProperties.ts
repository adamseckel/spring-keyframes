import { Frame, Keyframe } from "@spring-keyframes/driver"

export function filterTweenedProperties(from: Frame, to: Frame, tweened: string[] = []) {
  const t = ["transformOrigin"].concat(tweened)
  const tweenedFrom: Keyframe = {
    offset: 0,
  }
  const tweenedTo: Keyframe = {
    offset: 1,
  }
  const sprungFrom: Frame = {}
  const sprungTo: Frame = {}

  let hasTweened = false
  let hasSprung = false

  for (const key in from) {
    if (t.includes(key)) {
      hasTweened = true
      tweenedFrom[key] = from[key]
      tweenedTo[key] = to[key]
    } else {
      hasSprung = true
      sprungFrom[key] = from[key]
      sprungTo[key] = to[key]
    }
  }
  const value: { sprung?: { to: Frame; from: Frame }; tweened?: { to: Keyframe; from: Keyframe } } = {}

  if (hasSprung) {
    value.sprung = {
      from: sprungFrom,
      to: sprungTo,
    }
  }

  if (hasTweened) {
    value.tweened = {
      from: tweenedFrom,
      to: tweenedTo,
    }
  }

  return value
}
