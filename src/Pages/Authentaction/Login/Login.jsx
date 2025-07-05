import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../Hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {signIn} = useAuth()
  const location = useLocation();

  const navigate = useNavigate()

  const from = location.state?.from || '/';

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(res => {
        console.log(res.user);
        navigate(from)
      })
      .catch(error => console.log(error))
  };

  return (
    <div className="max-w-md mx-auto mt-10 card bg-white shadow-xl rounded-2xl p-6">
      <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">Please Log In</h1>
      <div>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4">
            <div>
              <label className="label font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email")}
                className="input input-bordered w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="label font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="input input-bordered w-full"
                placeholder="Enter your password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 text-sm mt-1">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 text-sm mt-1">
                  Password must be 6 characters or longer
                </p>
              )}
            </div>

            <div className="text-right">
              <a className="link link-hover text-sm text-blue-600">Forgot password?</a>
            </div>
          </fieldset>

          <button className="btn bg-amber-300 w-full mt-4">Login</button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link state={{from}} to="/register" className="text-blue-500 hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
        <SocialLogin/>
      </div>
    </div>
  );
};

export default Login;
