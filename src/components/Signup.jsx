import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const create = async (data) => {
    setError("");
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center m-2 p-2">
      <div
        className={`mx-auto w-full max-w-lg bg-[#2a3347] rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center text-white">
          <span className="inline-block w-full max-w-[100px] ml-12">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight  text-white">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base  text-white text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {/* we are going to display error here */}

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)} className="space-y-3 mt-4 text-left text-white">
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              type="text"
              {...register("name", { required: true })}
            />

            <Input
              label="Email: "
              placeholder="Enter your email here "
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password here "
              {...register("password", {
                required: true,
              })}
            />
            <Button className="w-full text-black bg-green-500 mt-4 font-semibold hover:text-black" type="submit">
              Signup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
