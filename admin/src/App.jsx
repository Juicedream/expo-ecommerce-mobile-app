import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

const App = () => {
  return (
    <div>
      <h1>Home page</h1>
      <SignedOut>
        <SignInButton mode="redirect"/>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default App