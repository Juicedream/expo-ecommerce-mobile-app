import { SignIn } from "@clerk/clerk-react"

const LoginPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <SignIn />
    </div>
  )
}

export default LoginPage