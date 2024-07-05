import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";

import { FormInput } from "../../components/FormComponents/FormInput";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../auth/tokenManager";
import { apiClient } from "../../apiClient";
import { useState } from "react";
//@ts-ignore
import { useYupValidationResolver } from "../../utils/yupResolver";
import { handleError } from "../../utils/handleError";


type Inputs = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
};

const schema = yup.object().shape({
  firstName: yup.string().required().label("First name"),
  lastName: yup.string().required().label("Last name"),
  email: yup.string().email().required().label("Email address"),
  password: yup.string().min(8).max(32).required()
    .test('passwords-match', 'Passwords do not match', function(value) {
      return this.parent.confirmPassword === value;
    })
    .label("Password"),
  confirmPassword: yup.string().min(8).max(32).required()
    .test('passwords-match', 'Passwords do not match', function(value) {
      return this.parent.password === value;
    })
    .label("Confirm password"),
});

export const BiologistSignup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: useYupValidationResolver(schema)
  });
  const navigate = useNavigate()
  const [error, setError] = useState();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { confirmPassword, ...formData } = data

    try {
      const res = await apiClient.post("/signup/biologist", formData)

      setToken(res.data.token)
      navigate("/account")
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
    }
  }

  return (
    <div
      className="h-full justify-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('http://localhost:8080/algae_background.webp')"}}>
        <div className="flex justify-center items-center h-full">
          <div className="bg-white border-2 rounded-lg p-8 shadow-lg shadow-neutral-400" style={{ width: 450 }}>
            <div className="mt-10 mb-8">
              <h2 className="text-2xl text-gray-900">Sign Up</h2>
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                required
                field="firstName"
                type="text"
                label="First name"
                placeholder="John"
                register={register}
                error={errors.firstName}
              />
              <FormInput
                required
                field="lastName"
                type="text"
                label="Last name"
                placeholder="Doe"
                register={register}
                error={errors.lastName}
              />
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
              <FormInput
                required
                field="confirmPassword"
                type="password"
                label="Confirm password"
                placeholder="•••••••••"
                register={register}
                error={errors.confirmPassword}
              />
              <button type="submit" className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:outline-none focus:ring-emerald-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
            </form>
          </div>
        </div>
      </div>
  )
}