import * as React from "react"

interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

interface ToastState {
  toasts: ToastProps[]
}

const toastState: ToastState = {
  toasts: []
}

const listeners: Array<(state: ToastState) => void> = []

function emitChange() {
  listeners.forEach((listener) => listener(toastState))
}

function toast(props: Omit<ToastProps, "id">) {
  const id = Math.random().toString(36).substr(2, 9)

  toastState.toasts.push({
    ...props,
    id,
  })

  emitChange()

  setTimeout(() => {
    toastState.toasts = toastState.toasts.filter((t) => t.id !== id)
    emitChange()
  }, 5000)

  return {
    id,
    dismiss: () => {
      toastState.toasts = toastState.toasts.filter((t) => t.id !== id)
      emitChange()
    },
  }
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(toastState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId: string) => {
      toastState.toasts = toastState.toasts.filter((t) => t.id !== toastId)
      emitChange()
    },
  }
}

export { toast, useToast }
