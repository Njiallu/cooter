import { Box, Card, createStyles, Group, ScrollArea } from "@mantine/core"
import { Machine } from "../features/Game"
import OperationButton from "./OperationButton"

const useStyles = createStyles((theme) => ({
  group: {
    height: 40,
    overflowX: "hidden",
    flexWrap: "nowrap",
    borderRadius: theme.radius.md,
    "&:after": {
      // content: ``,
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      background: `linear-gradient(transparent 150px, ${
        theme.colorScheme === "dark" ? theme.black : theme.white
      })`,
    },
  },
}))

export default function StackVisualizer({
  stack,
}: {
  stack: Machine["stack"]
}) {
  const { classes, cx } = useStyles()

  return (
    <Card withBorder p="xs" radius="lg">
      <Group spacing={2} className={classes.group}>
        {stack.map((op, key) => (
          <OperationButton op={op} key={key} />
        ))}
      </Group>
    </Card>
  )
}
