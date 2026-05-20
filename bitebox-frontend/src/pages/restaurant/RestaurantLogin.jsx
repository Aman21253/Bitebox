import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../../api/axios";

import AuthLayout from "../../layouts/AuthLayout";

import Input from "../../components/ui/Input";

import Button from "../../components/ui/Button";

function RestaurantLogin() {

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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      if (
        response.data.user.role !==
        "restaurant"
      ) {

        return alert(
          "Not a restaurant account"
        );
      }

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/restaurant/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
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
      ">

        <p className="
          text-orange-400
          uppercase
          tracking-[3px]
          text-xs
          font-bold
          mb-4
        ">
          Restaurant Portal
        </p>

        <h1 className="
          text-5xl
          font-black
          mb-3
        ">
          Restaurant Login
        </h1>

        <p className="
          text-gray-400
          mb-8
        ">
          Manage your restaurant orders.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <Button
            type="submit"
            loading={loading}
          >
            Login
          </Button>

        </form>

        <p className="
          text-center
          mt-8
          text-gray-400
        ">

          New restaurant owner?

          <Link
            to="/restaurant/register"
            className="
              text-orange-400
              font-semibold
              ml-2
            "
          >
            Register
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
}

export default RestaurantLogin;