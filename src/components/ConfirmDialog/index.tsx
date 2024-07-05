type ConfirmDialogProps = {
  showDialog: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ showDialog, onConfirm, onCancel, title, message }: ConfirmDialogProps) => {
  return (
    showDialog &&
    <div 
    style={{ zIndex: 9999, backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", top: 0, left: 0, display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
            <button
              type="button"
              className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={onCancel}
            >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
            <p className="mb-4 text-lg text-gray-800">{title || "Are you sure?"}</p>
            {message &&
              <p className="mt-3 mb-4 text-base text-gray-600">{message}</p>
            }
            <div className="flex justify-center items-center space-x-4">
              <button
                type="button"
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-3 text-sm font-medium text-center text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}