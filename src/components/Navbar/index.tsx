import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"

import { useCurrentUser } from "../../auth/useCurrentUser"

export const Navbar = () => {
  const { token, logout } = useCurrentUser()
  const [ isHidden, setIsHidden ] = useState(true)

  return (
    <nav className="bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-600" style={{ zIndex: 9999 }}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Algae Tracking</span>
          </Link>
        </div>
        <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
          {!token
          ? <>
              <NavButton goTo="/login" buttonText="Log In" />
              <div className="ml-4">
                <NavButton goTo="/signup" buttonText="Sign Up" />
              </div>
            </>
          : <>
              <button
                type="button"
                onClick={logout}
                className="text-white font-medium rounded-lg text-sm px-4 py-2 text-center bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:outline-none focus:ring-emerald-800"
              >
                Logout
              </button>
              <button type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" onClick={() => {
                setIsHidden(!isHidden)
              }}>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
              </button>
            </>
          }
        </div>
        {token &&
          <div hidden={isHidden} className="items-center justify-between w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink to="/account">
                  {({ isActive }) => (
                  <p className={`${isActive ? "md:text-emerald-400 bg-emerald-700" : "hover:bg-gray-700 md:hover:text-emerald-100"} block text-white py-2 px-3 rounded md:bg-transparent md:hover:bg-transparent md:p-0 border-gray-700`}>Account</p>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/observations">
                {({ isActive }) => (
                  <p className={`${isActive ? "md:text-emerald-400 bg-emerald-700" : "hover:bg-gray-700 md:hover:text-emerald-100"} block text-white py-2 px-3 rounded md:bg-transparent md:hover:bg-transparent md:p-0 border-gray-700`}>Observations</p>
                )}
                </NavLink>
              </li>
            </ul>
          </div>
        }
      </div>
    </nav>
  )
}

type NavButtonProps = {
  goTo: '/login' | '/signup',
  buttonText: string
}

const NavButton = ({ goTo, buttonText}: NavButtonProps ) => {
  return (
    <Link to={goTo}>
      <button
        type="button"
        className="text-white font-medium rounded-lg text-sm px-4 py-2 text-center bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:outline-none focus:ring-emerald-800"
      >
        {buttonText}
      </button>
    </Link>
  )
}
