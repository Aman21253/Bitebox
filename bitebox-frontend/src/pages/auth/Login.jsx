import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../api/axios";

import AuthLayout from "../../layouts/AuthLayout";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/");

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

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        <h2 className="text-4xl font-bold mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-500 mb-8">
          Login to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <Input
            label="Email Address"
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

        <p className="text-center mt-6 text-gray-600">

          Don’t have an account?

          <Link
            to="/register"
            className="text-orange-500 font-bold ml-2"
          >
            Register
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
}

export default Login;