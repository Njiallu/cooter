import {
  Box,
  Card,
  Center,
  Container,
  createStyles,
  SimpleGrid,
} from "@mantine/core"
import { IconCircle, IconSquare, IconStar, IconTriangle } from "@tabler/icons"
import { ReactNode } from "react"
import { threadId } from "worker_threads"
import { Cell, CellModifier, Machine } from "../features/Game"

const useStyles = createStyles((theme) => {
  const dark = theme.colorScheme === "dark"

  return {
    comon: {
      padding: 6,
      borderRadius: theme.radius.md,
      width: 50,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ["& > *"]: {
        width: "100%",
        height: "100%",
      },
    },
    red: {
      background: theme.colors.red[dark ? 8 : 3],
    },
    blue: {
      background: theme.colors.blue[dark ? 8 : 3],
    },
    green: {
      background: theme.colors.green[dark ? 8 : 3],
    },
    empty: {
      background: "transparent",
    },
  }
})

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
  const { classes, cx } = useStyles()
  const { map } = machine

  return (
    <>
      <Center>
        <Container size="xl" p={0}>
          <Card withBorder radius="lg">
            <SimpleGrid cols={map.width} spacing={4}>
              {map.cells.map((cell) => (
                <Box
                  className={cx(
                    classes.comon,
                    cell?.color ? classes[cell.color] : classes.empty
                  )}
                >
                  {cell?.modifier && modifierIcon[cell?.modifier]}
                </Box>
              ))}
            </SimpleGrid>
          </Card>
        </Container>
      </Center>
    </>
  )
}
