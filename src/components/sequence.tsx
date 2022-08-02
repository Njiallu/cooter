import { Map, Robot } from "../features/Game"
import { createStyles, Text } from "@mantine/core"
import { useListState } from "@mantine/hooks"
import { IconArrowLeft, IconArrowUp } from "@tabler/icons"
import { Dispatch, SetStateAction } from "react"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import theme from "../features/Theme"

interface RobotEditorInterface {
  robot: Robot
  setRobot: Dispatch<SetStateAction<Robot>>
}

const mockdata = {
  instructions: [
    {
      dir: "onward",
      color: "gray",
      icon: IconArrowUp,
      symbol: IconArrowUp,
      mass: "1",
      position: 1,
      name: "onward",
    },
    {
      dir: "left",
      color: "green",
      icon: IconArrowLeft,
      symbol: IconArrowLeft,
      mass: "1",
      position: 2,
      name: "left",
    },
  ],
}

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

interface DndListProps {
  data: {
    position: number
    mass: number
    symbol: string
    name: string
  }[]
}

export const RobotEditor = ({ robot, setRobot }: RobotEditorInterface) => {
  const { classes, cx } = useStyles()
  const [state, handlers] = useListState(robot)

  const items = mockdata.instructions.map((item, index) => (
    <Draggable key={index} index={index} draggableId={item.name}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text className={classes.symbol}>hello</Text>
          <div>
            <Text>{item.name}</Text>
            <Text color="dimmed" size="sm">
              Position: {item.position} • Mass: {item.mass}
            </Text>
          </div>
        </div>
      )}
    </Draggable>
  ))

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
