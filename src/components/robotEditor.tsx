import { Instruction, Map, Operation, Robot } from "../features/Game"
import { createStyles, Text } from "@mantine/core"
import { useListState } from "@mantine/hooks"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import OperationButton from "./OperationButton"

import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd"

//interface for props
interface RobotEditorInterface {
  robot: Robot
  setRobot: Dispatch<SetStateAction<Robot>>
}

//Styling for component
const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },
}))

export const RobotEditor = ({ robot, setRobot }: RobotEditorInterface) => {
  const { classes, cx } = useStyles()
  const [state, handlers] = useListState(robot[0])
  const [isBrowser, setIsBrowser] = useState(false)

  //found this on StackOverflow to fix a bug
  // TO DO: read connected to that bug
  useEffect(() => {
    setIsBrowser(process.browser)
  }, [])

  //Creates Draggable components
  const stack = state.map((item, index) => (
    <Draggable
      key={item.instruction}
      index={index}
      draggableId={item.instruction}
    >
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <OperationButton op={item as Operation} key={index} />
        </div>
      )}
    </Draggable>
  ))

  return (
    //Context for Draggable conponents
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId="stack-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {stack}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
