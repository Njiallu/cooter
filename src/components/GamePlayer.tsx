import { ActionIcon, Center, Group, Stack } from "@mantine/core"
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
import { nextMachineState } from "../features/Game"

export default function GamePlayer() {
  const {
    machine: { map, stack, done, alive },
    running,
    setRunning,
    next,
    prev,
    first,
    last,
    step,
    history,
  } = usePlayer()
  const toggle = () => setRunning((prev) => !prev)
  console.log("History", history.length, step)

  return (
    <>
      <Stack>
        <GameVisualizer map={map} />
        <StackVisualizer stack={stack} />

        <Center>
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
        </Center>
      </Stack>
    </>
  )
}
