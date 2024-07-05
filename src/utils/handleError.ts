import { isAxiosError } from "axios"


export const handleError = (err: unknown) => {
  if (isAxiosError(err)) {
    return err.response?.data.message || err.message || "Unexpected error occurred"
  } else if (err instanceof Error) {
    return err.message || "Unexpected error occurred"
  } else {
    "Unexpected error occurred"
  }
}
