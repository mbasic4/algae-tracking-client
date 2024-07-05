import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-simple-toasts';

import { FormInput } from '../../components/FormComponents/FormInput';
import { FormSelect } from '../../components/FormComponents/FormSelect';
import { apiClient } from '../../apiClient';
import { transformToNumber } from '../../utils/transformToNumber';
import { WaterColorEnum, waterColorOptions } from '../../constants';
import { useState } from 'react';
import { handleError } from '../../utils/handleError';

type Inputs = {
  waterColor: WaterColorEnum,
  secchiDepth: string;
  phosphorusConcentration: string;
};

type CreateNewObservationProps = {
  isOpen: boolean;
  onCreateObservation: () => void;
  closeDrawer: () => void;
  observationRequestId?: number;
  bodyOfWaterId: number;
  locationId?: number;
  lat?: number;
  lon?: number;
}

export const CreateNewObservation = (
  { isOpen, closeDrawer, onCreateObservation, observationRequestId, bodyOfWaterId, locationId, lat, lon }: CreateNewObservationProps
) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [error, setError] = useState();

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      await apiClient.post("/observations", {
        waterColor: formData.waterColor,
        secchiDepth: transformToNumber(formData.secchiDepth),
        phosphorusConcentration: transformToNumber(formData.phosphorusConcentration),
        bodyOfWaterId,
        locationId,
        lat,
        lon,
        observationRequestId
      })

      onCreateObservation()

      toast("New observation successfully created!", {
        position: "bottom-right",
        theme: "success"
      });
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
    }
  }

  return (
      <>
        <Drawer
          open={isOpen}
          onClose={closeDrawer}
          direction='right'
          style={{ zIndex: 9999, width: 400, padding: 20 }}
      >
          <h1 className='text-2xl mt-2 mb-5'>
            {observationRequestId ? "Respond To Observation Request" : "Create New Observation"}
          </h1>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormSelect
              field="waterColor"
              label="Choose water color"
              options={waterColorOptions}
              register={register}
            />
            <FormInput
              field="secchiDepth"
              type="number"
              label="Secchi depth (cm)"
              register={register}
              error={errors.secchiDepth}
            />
            <FormInput
              field="phosphorusConcentration"
              type="number"
              label="Phosphorus concentration (μg/L)"
              register={register}
              error={errors.phosphorusConcentration}
            />
            <button type="submit" className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:outline-none focus:ring-emerald-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
          </form>
        </Drawer>
      </>
  )
}