import { animated, AnimateExit } from '@spring-keyframes/react-emotion'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import styled from '@emotion/styled'
import { Column, Row } from 'emotion-box'

export function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [counter, setCounter] = useState(0)

  const removeNotification = notification => {
    const newNotes = notifications.filter(n => n !== notification)
    setNotifications(newNotes)
  }

  const addNotification = notification => {
    const [first, ...rest] = notifications
    const notes = notifications.length > 4 ? rest : notifications
    setNotifications([...notes, notification])
  }

  useEffect(() => {
    const interval = setInterval(() => {
      addNotification(counter)
      setCounter(counter + 1)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [notifications, counter])

  return (
    <Column
      style={{ position: 'relative', width: '100%', height: '100%' }}
      justify="center"
      align="center">
      <AnimateExit>
        {notifications.map((notification, i) => (
          <StackedNotification
            key={notification}
            index={i}
            onClick={() => removeNotification(notification)}
            offset={notifications.length}
          />
        ))}
      </AnimateExit>
    </Column>
  )
}

function StackedNotification({ index, offset, onClick }) {
  return (
    <NotificationContainer
      justify="start"
      align="start"
      onClick={onClick}
      initial={{
        y: offset * 60,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{ y: index * 60, opacity: 1, scale: 1 }}
      transition={{
        stiffness: 300,
        damping: 10,
        mass: 1,
        tweenedProps: [],
      }}
      exit={{ y: index * 60, opacity: 0, scale: 0.2 }}
    />
  )
}

export function LayeredNotifications() {
  const [notifications, setNotifications] = useState([])
  const [counter, setCounter] = useState(0)

  const removeNotification = notification => {
    const newNotes = notifications.filter(n => n !== notification)
    setNotifications(newNotes)
  }

  const addNotification = notification => {
    setNotifications([notification, ...notifications.slice(0, 3)])
  }

  useEffect(() => {
    const interval = setInterval(() => {
      addNotification(counter)
      setCounter(counter + 1)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [notifications, counter])

  return (
    <Column
      style={{ position: 'relative', width: '100%', height: '100%' }}
      justify="center"
      align="center">
      <AnimateExit>
        {notifications.map((notification, i) => (
          <LayeredNotification
            key={notification}
            index={i}
            onClick={() => removeNotification(notification)}
            offset={notifications.length}
          />
        ))}
      </AnimateExit>
    </Column>
  )
}

const indexScaleMap = [1, 0.95, 0.9, 0.85, 0.8]

function LayeredNotification({ index, offset, onClick }) {
  return (
    <NotificationContainer
      withShadow={true}
      justify="start"
      align="start"
      initial={{
        y: 100,
        opacity: 0,
        scale: 1,
      }}
      animate={{
        y: index * -15,
        opacity: 1,
        scale: indexScaleMap[index],
      }}
      transition={{
        stiffness: 250,
        damping: 14,
        mass: 1,
        tweenedProps: [index > 0 ? 'opacity' : undefined],
      }}
      style={{
        zIndex: offset - index,
      }}
      exit={{
        y: (index + 1) * -15,
        opacity: 0,
        scale: indexScaleMap[index + 1],
      }}
    />
  )
}

const NotificationContainer = styled(animated.div)`
  width: 400px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  background: #0052ff;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center center;
  box-shadow: ${props =>
    props.withShadow ? '0px -2px 10px 10px rgba(0,0,0,0.2)' : 'none'};
`
