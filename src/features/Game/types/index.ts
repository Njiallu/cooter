/**
 * Every Cell type
 */
export type Cell = "red" | "blue" | "green"
/**
 * Modifier to add behavior on cells
 */
export type CellModifier =
  // There needs to be none present on the map to win
  // You kinda pick them up
  | "checkpoint"
  // Barriers
  | "barrier-on"
  | "barrier-off"
  // Buttons
  | "button-on"
  | "button-off"

/**
 * The map to execute the robot on the state machine
 */
export type Map = ({ color: Cell; modifier?: CellModifier } | undefined)[][]

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

/**
 * A function can be executed by the state machine
 */
export type Function = (
  | {
      instruction: Instruction
      condition?: Cell
    }
  | undefined
)[]

/**
 * The robot that can be send to the state machine
 * and executed to complete the puzzle
 */
export type Robot = Function[]
