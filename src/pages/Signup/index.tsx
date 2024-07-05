import { Link } from "react-router-dom"

export const SignupPage = () => {
  return (
    <div
      className="h-full justify-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('http://localhost:8080/algae_background.webp')"}}>
        <div className="h-full p-20">
          <div className="md:grid grid-cols-2 gap-32 h-full">
            <div className="mb-9 md:mb-0 content-center justify-self-center md:justify-self-end">
              <Link to="/signup/citizen-scientist">
                <UserButton buttonText="Citizen-Scientist" />
              </Link>
            </div>
            <div className="content-center md:justify-self-start">
              <Link to="/signup/biologist">
                <UserButton buttonText="Biologist" />
              </Link>
            </div>
          </div>
        </div>
    </div>
  )
}

type UserButtonProps = {
  buttonText: string;
}

const UserButton = ({ buttonText }: UserButtonProps) => {
  return (
    <div className="bg-white border-2 rounded-lg w-96 h-80 p-2 shadow-lg shadow-neutral-400 hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer">
      <div className="h-full content-center border-2 border-emerald-600 rounded-lg">
        <p className="text-center text-2xl font-semibold tracking-wide text-slate-800">{buttonText}</p>
      </div>
    </div>
  )
}
