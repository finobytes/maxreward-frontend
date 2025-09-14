import React from "react";
import { loginBanner } from "../assets/assets";

const Login = () => {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src={loginBanner}
          className="absolute inset-0 size-full object-cover"
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
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Username / Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#FF5A29] sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#FF5A29] sm:text-sm/6"
                      />
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
                      <a
                        href="#"
                        className="font-semibold text-[#FF5A29] hover:text-[#FF5A29]/50"
                      >
                        Forgot password?
                      </a>
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

              <div className="mt-10">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-200 " />
                  </div>
                  <div className="relative flex justify-center text-sm/6 font-medium">
                    <span className="bg-white px-6 text-gray-900 ">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span className="text-sm/6 font-semibold">Google</span>
                  </a>

                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path
                        fill="#1877F2"
                        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.038 4.388 11.044 10.125 11.927v-8.437H7.078v-3.49h3.047V9.845c0-3.017 1.791-4.688 4.533-4.688 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.493 0-1.954.928-1.954 1.879v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.117 24 18.111 24 12.073z"
                      />
                      <path
                        fill="#fff"
                        d="M16.671 15.563l.532-3.49h-3.328v-2.25c0-.951.461-1.879 1.954-1.879h1.513V5.991s-1.374-.235-2.686-.235c-2.742 0-4.533 1.671-4.533 4.688v2.228H7.078v3.49h3.047V24h3.75v-8.437h2.796z"
                      />
                    </svg>
                    <span className="text-sm/6 font-semibold">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
