import { Box, Card, Group } from "@mantine/core"
import { Machine } from "../features/Game"
import OperationButton from "./OperationButton"

export default function StackVisualizer({
  stack,
}: {
  stack: Machine["stack"]
}) {
  return (
    <Card withBorder p="xs" radius="lg">
      <Group spacing={2}>
        {stack.map((op) => (
          <OperationButton op={op} />
        ))}
      </Group>
    </Card>
  )
}
