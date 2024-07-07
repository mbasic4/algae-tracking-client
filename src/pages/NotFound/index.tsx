import { Link } from "react-router-dom"

export const NotFound = () => {
  return (
    <div className="flex-1 content-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">404</h1>
              <p className="mb-7 text-2xl tracking-tight font-bold text-gray-600 md:text-3xl">
                Whoops! That page doesn't exist.
              </p>
              <Link to="/" replace>
                <button
                className="text-white font-medium rounded-lg text-base p-4 text-center bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:outline-none focus:ring-emerald-800"
                >
                  Back to Homepage
                </button>
              </Link>
          </div>   
      </div>
    </div>
  )
}
