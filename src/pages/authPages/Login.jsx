import React from "react";
import { useForm } from "react-hook-form";
import { loginBanner } from "../../assets/assets";
import ErrorMsg from "../../components/errorMsg/ErrorMsg";
import { Link } from "react-router";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    // try {
    // } catch (error) {
    //   console.error("API Error:", error);
    // }
  };
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src={loginBanner}
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute bottom-0 flex bg-white w-full py-4 px-6 justify-between text-sm/6">
          <div>
            <p className="text-gray-400">
              Copyright © 2025 <span className="text-[#FF5A29]">MaxReward</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400">
              Develop with ❤️ by{" "}
              <span className="text-blue-500">FinoBytes</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <h1 className="text-[#FF5A29] text-2xl font-bold">MaxReward</h1>
        <div className="flex flex-1 items-center justify-center">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="">
              <div>
                <p className="mt-2 text-[#FF5A29] text-lg">Welcome Back !</p>
                <p className="mt-2 text-gray-400">
                  Sign in to continue to Max Reward
                </p>
              </div>
              <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      User Id
                    </label>
                    <div className="mt-2">
                      <input
                        id="userId"
                        name="userId"
                        type="text"
                        {...register("userId", {
                          required: "User Id is required",
                        })}
                        autoComplete="username"
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 ${
                          errors.userId
                            ? "outline-red-500 focus:outline-red-500"
                            : "outline-gray-300 focus:outline-[#FF5A29]"
                        } sm:text-sm/6`}
                      />
                      {errors.userId && (
                        <ErrorMsg message={errors.userId.message} />
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                            message:
                              "Password must contain at least 1 uppercase, 1 number & 1 special character",
                          },
                        })}
                        autoComplete="current-password"
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 ${
                          errors.password
                            ? "outline-red-500 focus:outline-red-500"
                            : "outline-gray-300 focus:outline-[#FF5A29]"
                        } sm:text-sm/6`}
                      />
                      {errors.password && (
                        <ErrorMsg message={errors.password.message} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-6 shrink-0 items-center">
                        <div className="group grid size-4 grid-cols-1">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            {...register("remember")}
                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#FF5A29] checked:bg-[#FF5A29] indeterminate:border-[#FF5A29] indeterminate:bg-[#FF5A29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A29] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          />
                          <svg
                            fill="none"
                            viewBox="0 0 14 14"
                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                          >
                            <path
                              d="M3 8L6 11L11 3.5"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-has-checked:opacity-100"
                            />
                            <path
                              d="M3 7H11"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-has-indeterminate:opacity-100"
                            />
                          </svg>
                        </div>
                      </div>
                      <label
                        htmlFor="remember-me"
                        className="block text-sm/6 text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm/6">
                      <Link
                        to="/reset-password"
                        className="font-semibold text-[#FF5A29] hover:text-[#FF5A29]/50"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-[#FF5A29] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#FF5A29]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A29]"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
