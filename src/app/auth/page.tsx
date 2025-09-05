import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Welcome 👋</h1>
      <div className="space-x-4">
        <Link href="/auth/login" className="text-blue-600 underline">
          Login
        </Link>
        <Link href="/auth/signup" className="text-green-600 underline">
          Signup
        </Link>
      </div>
    </main>
  )
}
