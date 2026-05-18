import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../api/axios";

import AuthLayout from "../../layouts/AuthLayout";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Register() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SEND OTP

  const sendOtp = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.post("/auth/otp/send", {
        phone: formData.phone,
        purpose: "registration",
      });

      alert("OTP sent successfully");

      setStep(2);

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed to send OTP"
      );

    } finally {

      setLoading(false);
    }
  };

  // VERIFY OTP

  const verifyOtpAndRegister = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.post("/auth/otp/verify", {
        phone: formData.phone,
        code: otp,
        purpose: "registration",
      });

      console.log(formData);
      
      await API.post(
        "/auth/register",
        formData
      );

      alert("Registration successful");

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <AuthLayout>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        <h2 className="text-4xl font-bold mb-2">
          Create Account
        </h2>

        <p className="text-gray-500 mb-8">
          Join BiteBox today
        </p>

        {
          step === 1 ? (

            <form
              onSubmit={sendOtp}
              className="space-y-5"
            >

              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
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
                className="bg-orange-500 hover:bg-orange-600"
              >
                Send OTP
              </Button>

            </form>

          ) : (

            <form
              onSubmit={verifyOtpAndRegister}
              className="space-y-5"
            >

              <Input
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                placeholder="6 digit OTP"
              />

              <Button
                type="submit"
                loading={loading}
              >
                Verify OTP & Register
              </Button>

            </form>

          )
        }

        <p className="text-center mt-6 text-gray-600">

          Already have an account?

          <Link
            to="/login"
            className="text-orange-500 font-bold ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
}

export default Register;