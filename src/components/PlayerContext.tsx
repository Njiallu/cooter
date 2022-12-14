import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"
import {
  createMachine,
  Machine,
  Map,
  nextMachineState,
  Operation,
  Robot,
} from "../features/Game"
import { useLocalStorage } from "@mantine/hooks"

interface HistoryEntry {
  stack: Operation[]
  map: Map
}

interface Context {
  // Original map to use when you destroy history
  map: Map
  // History to manual step back and forward
  // So we basicaly save the state machine when we create an entry
  history: HistoryEntry[]
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>

  // The game player
  // Meaning you can play/pause the game, take manual a step back/next
  // Select the speed you want the game to play at, or something
  running: boolean
  setRunning: Dispatch<SetStateAction<boolean>>
  // Selected step [0-history.length]
  step: number
  setStep: Dispatch<SetStateAction<number>>

  // State machine props the know ending states
  machine: Machine
  setMachine: Dispatch<SetStateAction<Machine>>

  speed: number
  setSpeed: Dispatch<SetStateAction<number>>
}

const PlayerContext = createContext<Context | null>(null)
// export const usePlayerBackend = () => useContext(PlayerContext)
export const usePlayer = (): {
  robot: Robot
  setRobot: Dispatch<SetStateAction<Robot>>

  history: Context["history"]
  setHistory: Context["setHistory"]
  running: Context["running"]
  setRunning: Context["setRunning"]
  step: number

  speed: Context["speed"]
  setSpeed: Context["setSpeed"]

  next: () => void
  prev: () => void
  first: () => void
  last: () => void

  machine: Context["machine"]
} => {
  const ctx = useContext(PlayerContext)
  if (!ctx)
    throw new Error(
      "You need to create a Player provider wrapping your components"
    )

  return {
    robot: ctx.machine.robot,
    setRobot(value) {
      // Reset the player state
      // We need to delete history for when the user sets the robot
      ctx.setHistory([])
      ctx.setMachine(
        createMachine({
          map: ctx.map,
          robot: typeof value === "function" ? value(ctx.machine.robot) : value,
        })
      )
    },
    // Don't need to do anything particular here
    history: ctx.history,
    setHistory: ctx.setHistory,
    next() {
      const {
        step,
        setStep,
        history,
        setHistory,
        machine,
        setMachine,
        setRunning,
      } = ctx

      // We just need to update the step
      if (history.length - 1 > step) {
        setStep((prev) => prev + 1)
        return
      }
      if (!machine.alive || machine.done) {
        setRunning(false)
        return
      }

      // We need to compute the next state of the machine before updating
      const next = nextMachineState(machine)
      setHistory((prev) => [...prev, { map: next.map, stack: next.stack }])
      setMachine(next)
      setStep((s) => s + 1)

      // If the machine is done we can just stop playing as well
      if (next.done) setRunning(false)
    },
    prev() {
      ctx.setStep((s) => (s > 0 ? s - 1 : s))
    },
    first() {
      ctx.setStep(0)
    },
    last() {
      const { history, setRunning, setStep } = ctx
      setStep(history.length - 1)
      setRunning(false)
    },

    step: ctx.step,
    running: ctx.running,
    setRunning: ctx.setRunning,
    machine: ctx.machine,

    speed: ctx.speed,
    setSpeed: ctx.setSpeed,
  }
}

export const PlayerProvider = ({
  children,
  map,
}: {
  children: ReactNode
  map: Map
}) => {
  const [machine, setMachine] = useState<Machine>(
    createMachine({
      map,
      robot: [
        [
          { instruction: "onward" },
          { instruction: "left", condition: "green" },
          { instruction: "f0" },
          { instruction: "onward" },
        ],
      ],
    })
  )
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      map: map,
      stack: machine.stack,
    },
  ])
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useLocalStorage({
    key: "player-speed",
    defaultValue: 1000,
  })

  return (
    <PlayerContext.Provider
      value={{
        map,

        history,
        setHistory,

        step,
        setStep,
        running,
        setRunning,

        machine,
        setMachine,

        speed,
        setSpeed,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
