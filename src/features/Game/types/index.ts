/**
 * Cardinal direction
 */
export type Orientation = "n" | "w" | "s" | "e"
export type Point = { x: number; y: number }
/**
 * Every Cell type
 */
export type Cell = "red" | "blue" | "green"
// 'robot n'
// 'robot w'
// 'robot s'
// 'robot e'
export type RobotCell = `robot ${Orientation}`
/**
 * Modifier to add behavior on cells
 */
export type CellModifier =
  // There needs to be none present on the map to win
  // You kinda pick them up
  | "checkpoint"
  | "barrier"
  | "button"
  // Robot
  | RobotCell

export type MapCell = { color: Cell; modifier?: CellModifier } | undefined
/**
 * The map to execute the robot on the state machine
 */
export type Map = {
  cells: MapCell[]
  width: number
  height: number
}

/**
 * Every instruction a robot can complete on 1 step of the state machine
 */
export type Instruction =
  // Directions
  | "right" //  Turn right
  | "left" //   Turn left
  | "onward" // Move forward
  // Functions
  | `f${number}` // Call function, 0 indexed
  // Paint
  | "red" //   Paint red
  | "blue" //  Paint blue
  | "green" // Paint green

export type Operation = {
  instruction: Instruction
  condition?: Cell
}
/**
 * A function can be executed by the state machine
 */
export type Function = Operation[]

/**
 * The robot that can be send to the state machine
 * and executed to complete the puzzle
 */
export type Robot = Function[]
