import { ActionIcon, Center, Group, Stack } from "@mantine/core"
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from "@tabler/icons"
import { Dispatch, SetStateAction, useState } from "react"
import { Machine } from "../features/Game"
import GameVisualizer from "./GameVisualizer"
import StackVisualizer from "./StackVisualizer"

export default function GamePlayer({
  machine: { map, stack, robot },
  setMachine,
}: {
  machine: Machine
  setMachine: Dispatch<SetStateAction<Machine>>
}) {
  const [play, setPlay] = useState(false)

  return (
    <>
      <Stack>
        <GameVisualizer map={map} />
        <StackVisualizer stack={stack} />
        <Center>
          <Group>
            <ActionIcon color="blue" variant="light" size="lg">
              <IconPlayerSkipBack />
            </ActionIcon>
            <ActionIcon color="blue" variant="light" size="lg">
              {play ? <IconPlayerPause /> : <IconPlayerPlay />}
            </ActionIcon>
            <ActionIcon color="blue" variant="light" size="lg">
              <IconPlayerSkipForward />
            </ActionIcon>
          </Group>
        </Center>
      </Stack>
    </>
  )
}
