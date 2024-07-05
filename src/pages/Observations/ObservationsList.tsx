import { useState } from "react";
import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/success.css';
import 'react-simple-toasts/dist/theme/failure.css';

import { apiClient } from "../../apiClient"
import { waterColorOptions } from "../../constants"
import { EditObservation } from "./EditObservation"
import useToggle from "./useToggle";
import { Observation } from "./CitizenScientistObservations";
import { useCurrentUser } from "../../auth/useCurrentUser";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { handleError } from "../../utils/handleError";

type ObservationListProps = {
  observations: Array<Observation>;
  onEditObservation?: () => void;
  onDeleteObservation?: () => void;
}

export const ObservationsList = ({observations, onEditObservation, onDeleteObservation}: ObservationListProps) => {
  const { currentUser } = useCurrentUser()
  const [editObservationDraft, setEditObservationDraft] = useState<Observation>();
  const [observationIdToDelete, setObservationIdToDelete] = useState<number>();
  const [isToggled, toggle] = useToggle(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleObservationDelete = async (observationId: number) => {
    try {
      await apiClient.delete(`/observations/${observationId}`)

      onDeleteObservation && onDeleteObservation()
      toast("Observation successfully deleted!", {
        position: "bottom-right",
        theme: "success"
      });
    } catch (err) {
      const errorMessage = handleError(err)
      toast(errorMessage, {
        position: "bottom-right",
        theme: "failure"
      })
    }
  }

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
  }

  const confirmObservationDeletion = () => {
    observationIdToDelete && handleObservationDelete(observationIdToDelete);
    closeConfirmDialog();
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">
                  Obs_ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Water color
                </th>
                <th scope="col" className="px-6 py-3">
                  Secchi depth (cm)
                </th>
                <th scope="col" className="px-6 py-3">
                  Phosphorus (μg/L)
                </th>
                <th scope="col" className="px-6 py-3">
                  Requested by biologist
                </th>
                {currentUser?.citizenScientist &&
                <>
                  <th scope="col" className="px-6 py-3" />
                  <th scope="col" className="px-6 py-3" />
                </>
                }
            </tr>
        </thead>
        <tbody>
          {observations.map(obs =>
            <tr key={obs.id} className="odd:bg-white even:bg-gray-50 border-b">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {obs.id}
                </th>
                <td className="px-6 py-4">
                  {obs.waterColor ? waterColorOptions.find(opt => opt.value === obs.waterColor)?.label : "-"}
                </td>
                <td className="px-6 py-4">
                  {obs.secchiDepth || "-"}
                </td>
                <td className="px-6 py-4">
                  {obs.phosphorusConcentration || "-"}
                </td>
                <td className="px-6 py-4">
                  {obs.observationRequestId ? "Yes" : "No"}
                </td>
                {currentUser?.citizenScientist &&
                <>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-blue-600"
                      onClick={() => {
                        toggle()
                        setEditObservationDraft(obs)
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-blue-600"
                      onClick={() => {
                        setObservationIdToDelete(obs.id)
                        setShowConfirmDialog(true)
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </>
              }
            </tr>
          )}
        </tbody>
    </table>
    {editObservationDraft &&
      <EditObservation
        isOpen={isToggled}
        closeDrawer={toggle}
        observationId={editObservationDraft.id}
        waterColor={editObservationDraft.waterColor}
        secchiDepth={editObservationDraft.secchiDepth}
        phosphorusConcentration={editObservationDraft.phosphorusConcentration}
        onEdit={onEditObservation}
      />
    }
    <ConfirmDialog
      showDialog={showConfirmDialog}
      message="This observation will be permanently deleted."
      onConfirm={confirmObservationDeletion}
      onCancel={closeConfirmDialog}
    />
  </div>
  )
}