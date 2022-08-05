import {
  ActionIcon,
  Center,
  Container,
  Grid,
  Group,
  NumberInput,
  NumberInputHandlers,
  SimpleGrid,
  Stack,
} from "@mantine/core"
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
} from "@tabler/icons"
import { usePlayer } from "./PlayerContext"
import GameVisualizer from "./GameVisualizer"
import StackVisualizer from "./StackVisualizer"
import { useEffect, useRef } from "react"

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
  const handlers = useRef<NumberInputHandlers>()

  const toggle = () => setRunning((prev) => !prev)

  useEffect(() => {
    if (running) {
      const id = setInterval(() => next(), speed)
      return () => clearInterval(id)
    }
  }, [running, next, speed])

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
        <Group sx={{ justifySelf: "end" }}>test</Group>
      </SimpleGrid>
    </Stack>
  )
}
