import { LoginForm } from "@/components/login-form"

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-svh w-full flex-col bg-muted p-6 md:p-10">
      <div className=" max-w-sm md:max-w-3xl lg:w-full ml-48">
        <LoginForm />
      </div>
    </div>
  )
}
