import * as React from 'react'
import { Tags } from './tags'
import { Animated as Component } from './Component'

export function animated(tag: Tags) {
  return function() {
    let args = arguments[0]
    const Animated = (props: any) => {
      //@ts-ignore
      const ele = React.createElement(Component, { Tag: tag, ...props })
      return ele
    }

    return <Animated {...args} />
  }
}
