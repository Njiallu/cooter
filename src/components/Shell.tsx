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
  Divider,
} from "@mantine/core"
import { ReactNode } from "react"
import { IconHome, IconMoon, IconSun } from "@tabler/icons"
import Link from "next/link"

const breadcrumbsList = (path: string) => {
  // Remove any query parameters, as those aren't included in breadcrumbs
  const asPathWithoutQuery = path.split("?")[0]

  // Break down the path between "/"s, removing empty entities
  // Ex:"/my/nested/path" --> ["my", "nested", "path"]
  const asPathNestedRoutes = asPathWithoutQuery
    ?.split("/")
    .filter((v) => v.length > 0)

  // Iterate over the list of nested route parts and build
  // a "crumb" object for each one.
  const crumblist = asPathNestedRoutes?.map((subpath, idx) => {
    // We can get the partial nested route for the crumb
    // by joining together the path parts up to this point.
    const href = "/" + asPathNestedRoutes?.slice(0, idx + 1).join("/")
    // The title will just be the route string for now
    const name = subpath
    return { href, name }
  })

  // Add in a default "Home" crumb for the top-level
  return [{ href: "/", name: "Home" }, ...(crumblist ?? [])]
}

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
              <Link href="/">
                <Button variant="subtle" radius="md">
                  <Image src={"./favicon.svg"} width={30} height={30} />
                  <Divider mx={4} />
                  <Text color="green" size="xl" weight="bolder">
                    Cooter
                  </Text>
                </Button>
              </Link>
            </Group>
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
          height: "100%",
        }}
      >
        <Breadcrumbs>
          {breadcrumbs.map(({ href, name }, key) => (
            <Link href={href} key={key} passHref>
              <Anchor>{name}</Anchor>
            </Link>
          ))}
        </Breadcrumbs>
        <Card sx={{ height: "100%" }} radius="md" shadow="xl">
          {children}
        </Card>
      </Stack>
    </AppShell>
  )
}
