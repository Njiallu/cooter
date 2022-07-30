import { Box, Card, Center, createStyles, SimpleGrid } from "@mantine/core"
import { IconCircle, IconSquare, IconStar, IconTriangle } from "@tabler/icons"
import { ReactNode } from "react"
import { CellModifier, Machine } from "../features/Game"

const useStyles = createStyles((theme) => ({
  empty: {},
}))

const modifierIcon: Record<CellModifier, ReactNode> = {
  // Robot
  "robot n": <IconTriangle style={{ transform: "rotate(0deg)" }} />,
  "robot e": <IconTriangle style={{ transform: "rotate(90deg)" }} />,
  "robot s": <IconTriangle style={{ transform: "rotate(180deg)" }} />,
  "robot w": <IconTriangle style={{ transform: "rotate(270deg)" }} />,
  // Items
  barrier: <IconSquare />,
  button: <IconCircle />,
  checkpoint: <IconStar />,
}

export default function GameVisualizer({ machine }: { machine: Machine }) {
  const { map } = machine

  return (
    <>
      <Center>
        <Card shadow="xl" radius="lg">
          <SimpleGrid cols={map.width} spacing="xs">
            {map.cells.map((cell) => (
              <Box
                sx={(theme) => ({
                  background: theme.colors[cell?.color ?? "gray"][5],
                  padding: theme.spacing.xs,
                  borderRadius: theme.radius.md,
                  width: 50,
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                })}
              >
                {cell?.modifier && modifierIcon[cell?.modifier]}
              </Box>
            ))}
          </SimpleGrid>
        </Card>
      </Center>
    </>
  )
}
