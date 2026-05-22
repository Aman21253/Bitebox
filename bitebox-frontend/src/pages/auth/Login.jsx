import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      setLoading(true);
      const response =
        await API.post(
          "/auth/login",
          formData
        );

      // SAVE TOKEN
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      const role =
        response.data.user.role;

      // ROLE BASED REDIRECT
      if (role === "admin") {

        navigate(
          "/admin/dashboard"
        );
      
      } else if (
        role === "driver"
      ) {
      
        navigate(
          "/driver/dashboard"
        );
      
      } else if (
        role === "restaurant"
      ) {
      
        navigate(
          "/restaurant/dashboard"
        );
      
      } else {
      
        navigate("/");
      }

    } catch (error) {

      alert(
        error.response?.data
          ?.detail ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <AuthLayout>

      <div className="
        w-full
        max-w-[520px]
        bg-white/[0.04]
        backdrop-blur-2xl
        border
        border-white/10
        rounded-[36px]
        p-8
        md:p-10
        shadow-[0_20px_80px_rgba(0,0,0,0.35)]
      ">

        {/* HEADER */}

        <div className="mb-8">

          <p className="
            text-orange-400
            uppercase
            tracking-[3px]
            text-xs
            font-bold
            mb-4
          ">
            Welcome Back
          </p>

          <h2 className="
            text-5xl
            font-black
            tracking-tight
          ">
            Login
          </h2>

          <p className="
            text-gray-400
            mt-4
            text-lg
          ">
            Continue your premium
            food journey.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
          "
        >

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            loading={loading}
          >
            Login
          </Button>

        </form>

        {/* FOOTER */}

        <p className="
          text-center
          mt-8
          text-gray-400
        ">

          Don’t have an account?

          <Link
            to="/register"
            className="
              text-orange-400
              font-semibold
              ml-2
              hover:text-orange-300
            "
          >
            Register
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
}

export default Login;