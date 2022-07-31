import { Box, Card, Group, ScrollArea } from "@mantine/core"
import { Machine } from "../features/Game"
import OperationButton from "./OperationButton"

export default function StackVisualizer({
  stack,
}: {
  stack: Machine["stack"]
}) {
  return (
    <Card withBorder p="xs" radius="lg">
      <Group spacing={2} sx={{ minHeight: 40, overflowX: "clip" }}>
        {stack.map((op, key) => (
          <OperationButton op={op} key={key} />
        ))}
      </Group>
    </Card>
  )
}
