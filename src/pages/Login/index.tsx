import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";

import { FormInput } from "../../components/FormComponents/FormInput"
import { apiClient } from "../../apiClient";
import { useState } from "react";
//@ts-ignore
import { useYupValidationResolver } from "../../utils/yupResolver";
import { handleError } from "../../utils/handleError";
import { useCurrentUser } from "../../auth/useCurrentUser";

type Inputs = {
  email: string,
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email().required().label("Email address"),
  password: yup.string().required().label("Password"),
});

export const LoginPage = () => {
  const { login } = useCurrentUser()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: useYupValidationResolver(schema)
  });
  const [error, setError] = useState();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const res = await apiClient.post("/login", data);

      login(res.data.token)
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
    }
  }

  return (
    <div
      className="h-full justify-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('http://localhost:8080/algae_background.webp')"}}
    >
      <div className="flex justify-center items-center h-full">
        <div className="bg-white border-2 rounded-lg p-8 shadow-lg shadow-neutral-400" style={{ width: 450 }}>
          <div className="mt-10 mb-8">
            <h2 className="text-2xl text-gray-900">Log In</h2>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              required
              field="email"
              type="email"
              label="Email address"
              placeholder="john.doe@company.com"
              register={register}
              error={errors.email}
            />
            <FormInput
              required
              field="password"
              type="password"
              label="Password"
              placeholder="•••••••••"
              register={register}
              error={errors.password}
            />
            <button type="submit" className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:outline-none focus:ring-emerald-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}