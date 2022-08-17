import {
  ActionIcon,
  Anchor,
  AppShell,
  Breadcrumbs,
  Text,
  Image,
  Card,
  Group,
  Header,
  Stack,
  useMantineColorScheme,
  Button,
  Container,
} from "@mantine/core"
import { ReactNode } from "react"
import { IconEdit, IconList, IconMoon, IconSun } from "@tabler/icons"
import Link from "next/link"
import { breadcrumbsList } from "./utils"

type MenuEntry = {
  icon: ReactNode
  link: string // url
  label: ReactNode
}

const menuEntries: MenuEntry[] = [
  {
    icon: <IconList />,
    link: "/maps",
    label: "Maps",
  },
  {
    icon: <IconEdit />,
    link: "/map-editor",
    label: "Editor",
  },
]

export default function Shell({
  children,
  path,
}: {
  children: ReactNode
  path: string
}) {
  const breadcrumbs = breadcrumbsList(path)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <AppShell
      header={
        <Header height={74} p="md">
          <Group position="apart">
            <Group grow sx={{ height: "100%" }}>
              {/* Home page */}
              <Link href="/">
                <Button variant="subtle" radius="md">
                  <Image src={"/favicon.svg"} width={30} height={30} mr="sm" />
                  <Text color="green" size="xl" weight="bolder">
                    Cooter
                  </Text>
                </Button>
              </Link>
              {/* Menu entries */}
              {menuEntries.map(({ icon, link, label }, key) => (
                <Link href={link} key={key}>
                  <Button leftIcon={icon} variant="subtle" radius="md">
                    {label}
                  </Button>
                </Link>
              ))}
            </Group>
            {/* Toggle colorscheme */}
            <Group>
              <ActionIcon onClick={() => toggleColorScheme()}>
                {colorScheme === "dark" ? <IconMoon /> : <IconSun />}
              </ActionIcon>
            </Group>
          </Group>
        </Header>
      }
    >
      <Stack
        sx={{
          minHeight: "100%",
        }}
      >
        {/* Current user path */}
        <Breadcrumbs>
          {breadcrumbs.map(({ href, name }, key) => (
            <Link href={href} key={key} passHref>
              <Anchor>{name}</Anchor>
            </Link>
          ))}
        </Breadcrumbs>
        {/* Page body */}
        <Container
          size="md"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card
            sx={{ minHeight: "100%", minWidth: "100%" }}
            radius="md"
            shadow="xl"
          >
            {children}
          </Card>
        </Container>
      </Stack>
    </AppShell>
  )
}
