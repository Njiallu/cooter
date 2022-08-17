import { useRouter } from "next/router"

export default function Play() {
  const router = useRouter()
  const { id } = router.query

  return <>{id}</>
}
