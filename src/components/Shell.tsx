import {
  Anchor,
  AppShell,
  Breadcrumbs,
  Button,
  Card,
  Group,
  Header,
  Stack,
} from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons"
import { ReactNode } from "react"

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

  return (
    <AppShell
      header={
        <Header height={60} p="md">
          <Group>
            <Button leftIcon={<IconChevronLeft />}></Button>
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
            <Anchor href={href} key={key}>
              {name}
            </Anchor>
          ))}
        </Breadcrumbs>
        <Card sx={{ height: "100%" }} radius="md" shadow="xl">
          {children}
        </Card>
      </Stack>
    </AppShell>
  )
}
