import _, { map } from "lodash"
import {
  Robot,
  Map,
  Instruction,
  MapCell,
  Operation,
  Orientation,
  CellModifier,
  RobotCell,
  Cell,
} from "./types"

export type Task = { cell: MapCell; x: number; y: number }
export type Machine = {
  map: Map
  robot: Robot
  stack: Operation[]
  alive: boolean
  done: boolean
  success: boolean
}

const isRobot = (modifier: CellModifier | undefined): modifier is RobotCell =>
  modifier?.startsWith("robot") ?? false

const filterMap = (
  machine: Machine,
  condition: (cell: MapCell, x: number, y: number) => boolean
) =>
  machine.map.cells.reduce((acc, cell, idx) => {
    const y = Math.floor(idx / machine.map.width)
    const x = idx % machine.map.width
    if (!cell) return acc
    if (condition(cell, x, y)) return [...acc, { cell, x, y }]
    return acc
  }, [] as Task[])

const applyTasks = (machine: Machine, tasks: Task[]): Machine => {
  const map = _.cloneDeep(machine.map)

  tasks.forEach(({ cell, x, y }) => {
    map.cells[x + map.width * y] = cell
  })

  return { ...machine, map }
}

// When we execute the instruction we mutate the state of the machine
const execute: Record<
  Instruction,
  (machine: Machine, condition?: Cell) => Machine
> = {
  // Make robots turn right
  right: (machine, condition) => {
    const tasks = filterMap(
      machine,
      (cell) =>
        isRobot(cell?.modifier) && (!condition || cell?.color === condition)
    )

    tasks.map((task) => {
      switch (task.cell?.modifier) {
        case "robot n":
          task.cell.modifier = "robot e"
          break
        case "robot e":
          task.cell.modifier = "robot s"
          break
        case "robot s":
          task.cell.modifier = "robot w"
          break
        case "robot w":
          task.cell.modifier = "robot n"
          break
      }
    })

    return applyTasks(machine, tasks)
  },

  // Make robots turn left
  left: (machine, condition) => {
    const tasks = filterMap(
      machine,
      (cell) =>
        isRobot(cell?.modifier) && (!condition || cell?.color === condition)
    )

    tasks.map((task) => {
      switch (task.cell?.modifier) {
        case "robot n":
          task.cell.modifier = "robot w"
          break
        case "robot w":
          task.cell.modifier = "robot s"
          break
        case "robot s":
          task.cell.modifier = "robot e"
          break
        case "robot e":
          task.cell.modifier = "robot n"
          break
      }
    })

    return applyTasks(machine, tasks)
  },

  red: (machine, condition) => {
    const tasks: Task[] = filterMap(
      machine,
      (cell) =>
        isRobot(cell?.modifier) && (!condition || cell?.color === condition)
    ).map(({ cell, x, y }) => {
      if (cell?.color !== undefined) {
        return { cell: { color: "red", modifier: cell.modifier }, x, y }
      }
      return { cell, x, y }
    })
    return applyTasks(machine, tasks)
  },

  blue: (machine, condition) => {
    const tasks: Task[] = filterMap(
      machine,
      (cell) =>
        isRobot(cell?.modifier) && (!condition || cell?.color === condition)
    ).map(({ cell, x, y }) => {
      if (cell?.color !== undefined) {
        return { cell: { color: "blue", modifier: cell.modifier }, x, y }
      }
      return { cell, x, y }
    })
    return applyTasks(machine, tasks)
  },

  green: (machine, condition) => {
    const tasks: Task[] = filterMap(
      machine,
      (cell) =>
        isRobot(cell?.modifier) && (!condition || cell?.color === condition)
    ).map(({ cell, x, y }) => {
      if (cell?.color !== undefined) {
        return { cell: { color: "green", modifier: cell.modifier }, x, y }
      }
      return { cell, x, y }
    })
    return applyTasks(machine, tasks)
  },

  onward: (machine, condition) => {
    const tasks: Task[] = filterMap(
      machine,
      (cell) =>
        isRobot(cell?.modifier) && (!condition || cell?.color === condition)
    ).reduce((acc, { cell, x, y }) => {
      //determine next cell based on orientation
      const orientationLookup: Record<
        `robot ${Orientation}`,
        [number, number]
      > = {
        // x, y
        "robot e": [+1, 0],
        "robot w": [-1, 0],
        "robot s": [0, +1],
        "robot n": [0, -1],
      }
      // Explicitly tell what the robot is
      const robot = cell?.modifier
      if (robot && isRobot(robot)) {
        const [xoff, yoff] = orientationLookup[robot]
        const [xnext, ynext] = [x + xoff, y + yoff]
        const nextCell = machine.map.cells[xnext + ynext * machine.map.width]
        if (
          // Can't fall off the map
          xnext < 0 ||
          xnext > machine.map.width - 1 ||
          ynext < 0 ||
          ynext > machine.map.height - 1 ||
          // Can't crash into a wall
          nextCell?.modifier === "barrier" ||
          // Can't crash into an other robot
          isRobot(nextCell?.modifier) ||
          // Can't fall into the void
          !nextCell
        ) {
          machine.alive = false
          machine.done = true
          return [...acc, { cell: { color: cell.color }, x, y }]
        }

        // Next player positions
        const next = [
          {
            cell: { color: nextCell.color, modifier: cell.modifier },
            x: xnext,
            y: ynext,
          },
          {
            cell: { color: cell.color },
            x,
            y,
          },
        ]

        // If the robot ends up on a button we activate it
        if (nextCell.modifier === "button") {
          const obstacles = filterMap(
            machine,
            (cell) =>
              cell?.modifier === "barrier" || cell?.modifier === "button"
          )
            // Remove the button or barrier modifier
            .map(
              ({ cell, x, y }): Task => ({ cell: { color: cell!.color }, x, y })
            )
            // Remove the cell the robot should move to
            // As it will already be overritten
            .filter(({ x, y }) => !(xnext === x && ynext === y))
          return [...acc, ...obstacles, ...next]
        }
        // We just need to advance the robot
        return [...acc, ...next]
      }
      // Should never even get there ?
      console.error("WTF")
      return acc
    }, [] as Task[])
    console.log("Onward", tasks)

    return applyTasks(machine, tasks)
  },
}

export const createMachine = ({
  map,
  robot,
}: {
  map: Map
  robot: Robot
}): Machine => ({
  robot,
  map,
  stack: [...(robot[0] ?? [])],
  alive: true,
  done: false,
  success: false,
})

export const checkSuccess = (map: Map) =>
  map.cells.reduce(
    (valid, cell) => valid && cell?.modifier !== "checkpoint",
    true
  )

export const nextMachineState = (machine: Machine): Machine => {
  // Clone machine
  const { map, robot, stack, alive, done, success } = _.cloneDeep(machine)
  // Pop new instruction
  const operation = stack.shift()
  // We don't have instructions to pop any more so we are done
  if (!operation) return { map, robot, stack, alive, done: true, success }
  // We encountered a function so we need to expand it
  if (operation.instruction?.startsWith("f")) {
    const index = parseInt(operation.instruction.slice(1))
    const body = robot[index]
    console.log("F", index, body)
    // Append the function body to the execution stack when we need to call
    // the function
    if (!isNaN(index) && body) stack.unshift(...body)
    // We encountered an error as the function doesn't exist ?
    else throw new Error("Tried to expand function that doesn't exist")
    return { map, robot, stack, alive, done, success }
  }
  // Execture the next instruction
  const next = execute[operation.instruction]?.(
    { map, robot, stack, alive, done, success },
    operation.condition
  )
  const check = checkSuccess(next?.map ?? machine.map)
  return next ? { ...next, done: check || done, success: check } : machine
}
