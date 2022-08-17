import { Box, createStyles } from "@mantine/core"
import {
  IconArrowUp,
  IconBrush,
  IconCornerUpLeft,
  IconCornerUpRight,
} from "@tabler/icons"
import { ReactNode } from "react"
import { Cell, Instruction, Operation } from "../features/Game"

const operationIcon: Record<Instruction, ReactNode> = {
  // Paint
  red: <IconBrush color="red" />,
  blue: <IconBrush color="blue" />,
  green: <IconBrush color="green" />,
  // Movement
  left: <IconCornerUpLeft />,
  right: <IconCornerUpRight />,
  onward: <IconArrowUp />,
}

const useConditionStyles = createStyles<Cell | "comon" | "nocolor">((theme) => {
  const dark = theme.colorScheme === "dark"

  return {
    comon: {
      padding: 2,
      height: 40,
      width: 40,
      borderRadius: theme.radius.md,
      display: "flex",
      flexShrink: 0,
      justifyContent: "center",
      alignItems: "center",
      textTransform: "capitalize",
    },
    red: {
      backgroundColor: theme.colors.red[dark ? 7 : 3],
    },
    blue: {
      backgroundColor: theme.colors.blue[dark ? 7 : 3],
    },
    green: {
      backgroundColor: theme.colors.green[dark ? 7 : 3],
    },
    nocolor: {
      backgroundColor: theme.colors.gray[dark ? 8 : 1],
    },
  }
})

const isFunction = (instruction: Instruction): instruction is `f${number}` =>
  instruction.startsWith("f")

export default function OperationButton({
  op: { instruction, condition },
}: {
  op: Operation
}) {
  const { classes, cx } = useConditionStyles()
  return (
    <Box className={cx(classes.comon, classes[condition ?? "nocolor"])}>
      {isFunction(instruction) ? instruction : operationIcon[instruction]}
    </Box>
  )
}
