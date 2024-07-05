import { useCurrentUser } from "../../auth/useCurrentUser"
import { BiologistObservations } from "./BiologistObservations";
import { CitizenScientistObservations } from "./CitizenScientistObservations";


export const Observations = () => {
  const { currentUser } = useCurrentUser();

  return (
    currentUser?.citizenScientist
      ? <CitizenScientistObservations />
      : <BiologistObservations />
  )
}