import {
  ActionIcon,
  Center,
  Container,
  Grid,
  Group,
  MantineColor,
  NumberInput,
  NumberInputHandlers,
  SimpleGrid,
  Stack,
  ThemeIcon,
} from "@mantine/core"
import {
  IconDashboard,
  IconGaugeOff,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconStack,
  IconStack2,
  IconStack3,
} from "@tabler/icons"
import { usePlayer } from "./PlayerContext"
import GameVisualizer from "./GameVisualizer"
import StackVisualizer from "./StackVisualizer"
import { ReactNode, useEffect, useRef, useState } from "react"

const speedButton: { color: MantineColor; icon: ReactNode; speed: number }[] = [
  { color: "yellow", icon: <IconStack />, speed: 500 },
  { color: "orange", icon: <IconStack2 />, speed: 150 },
  { color: "red", icon: <IconStack3 />, speed: 10 },
]

export default function GamePlayer() {
  const {
    machine: { done, alive },
    running,
    setRunning,
    next,
    prev,
    first,
    last,
    step,
    history,
    speed,
    setSpeed,
  } = usePlayer()
  const toggle = () => setRunning((prev) => !prev)

  useEffect(() => {
    if (running) {
      const id = setInterval(() => next(), speed)
      return () => clearInterval(id)
    }
  }, [running, next, speed])

  const [selected, setSelected] = useState(0)

  return (
    <Stack>
      <GameVisualizer map={history[step]!.map} />
      <StackVisualizer stack={history[step]!.stack} />

      <SimpleGrid spacing="xs" cols={3}>
        <div></div>
        <Group spacing="xs">
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            radius="md"
            onClick={first}
            disabled={step === 0}
          >
            <IconPlayerSkipBack />
          </ActionIcon>
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            radius="md"
            onClick={prev}
            disabled={step === 0}
          >
            <IconPlayerTrackPrev />
          </ActionIcon>
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            radius="md"
            onClick={toggle}
          >
            {running ? <IconPlayerPause /> : <IconPlayerPlay />}
          </ActionIcon>
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            radius="md"
            onClick={next}
            disabled={step >= history.length - 1 && (done || !alive)}
          >
            <IconPlayerTrackNext />
          </ActionIcon>
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            radius="md"
            onClick={last}
            disabled={step >= history.length - 1}
          >
            <IconPlayerSkipForward />
          </ActionIcon>
        </Group>
        <Group sx={{ justifySelf: "end" }} spacing="xs">
          {/* <ThemeIcon size="lg"> */}
          <IconDashboard />
          {/* </ThemeIcon> */}
          <ActionIcon
            size="lg"
            color={speedButton[selected]?.color ?? "blue"}
            onClick={() => {
              setSelected((s) => (s + 1) % speedButton.length)
              setSpeed(
                speedButton[(selected + 1) % speedButton.length]?.speed ?? 1000
              )
            }}
          >
            {speedButton[selected]?.icon ?? <IconGaugeOff />}
          </ActionIcon>
        </Group>
      </SimpleGrid>
    </Stack>
  )
}
