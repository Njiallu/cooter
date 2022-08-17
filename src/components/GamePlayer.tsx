import { ActionIcon, Grid, Group, MantineColor, Stack } from "@mantine/core"
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
import { ReactNode, useEffect, useState } from "react"

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
  const lastStep = step >= history.length - 1

  return (
    <Stack>
      <GameVisualizer map={history[step]!.map} />
      <StackVisualizer stack={history[step]!.stack} />

      <Grid gutter="md" columns={5}>
        <Grid.Col span={1}></Grid.Col>

        <Grid.Col span={3}>
          <Group spacing="xs" align="center" position="center">
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
              disabled={lastStep && done}
            >
              {running ? <IconPlayerPause /> : <IconPlayerPlay />}
            </ActionIcon>
            <ActionIcon
              color="blue"
              variant="light"
              size="lg"
              radius="md"
              onClick={next}
              disabled={lastStep && (done || !alive)}
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
        </Grid.Col>

        <Grid.Col span={1}>
          <Group position="right" spacing="xs">
            {/* <ThemeIcon size="lg"> */}
            <IconDashboard />
            {/* </ThemeIcon> */}
            <ActionIcon
              size="lg"
              color={speedButton[selected]?.color ?? "blue"}
              onClick={() => {
                // Update on ui
                setSelected((s) => (s + 1) % speedButton.length)
                // Update machine speed
                setSpeed(
                  speedButton[(selected + 1) % speedButton.length]?.speed ??
                    1000
                )
              }}
            >
              {speedButton[selected]?.icon ?? <IconGaugeOff />}
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
