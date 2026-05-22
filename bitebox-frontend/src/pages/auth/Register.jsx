import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../api/axios";

import AuthLayout from "../../layouts/AuthLayout";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Register() {

  const navigate = useNavigate();

  const [step, setStep] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [otp, setOtp] =
    useState("");

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      phone: "",

      password: "",

      role: "customer",
    });

  // HANDLE CHANGE

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // SEND OTP

  const sendOtp = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.post(
        "/auth/otp/send",
        {

          phone:
            formData.phone,

          purpose:
            "registration",
        }
      );

      alert(
        "OTP sent successfully"
      );

      setStep(2);

    } catch (error) {

      alert(

        error.response?.data
          ?.detail ||

        "Failed to send OTP"
      );

    } finally {

      setLoading(false);
    }
  };

  // VERIFY OTP + REGISTER

  const verifyOtpAndRegister =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        // VERIFY OTP

        await API.post(
          "/auth/otp/verify",
          {

            phone:
              formData.phone,

            code: otp,

            purpose:
              "registration",
          }
        );

        // REGISTER USER

        await API.post(
          "/auth/register",
          formData
        );

        alert(
          "Registration successful"
        );

        navigate("/login");

      } catch (error) {

        alert(

          error.response?.data
            ?.detail ||

          "Registration failed"
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

        <div className="
          mb-8
        ">

          <p className="
            text-orange-400
            uppercase
            tracking-[3px]
            text-xs
            font-bold
            mb-4
          ">
            Create Account
          </p>

          <h2 className="
            text-5xl
            font-black
            tracking-tight
          ">
            Register
          </h2>

          <p className="
            text-gray-400
            mt-4
            text-lg
          ">
            Join BiteBox and start
            your premium journey.
          </p>

        </div>

        {
          step === 1 ? (

            <form
              onSubmit={sendOtp}
              className="
                space-y-5
              "
            >

              {/* NAME */}

              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

              {/* EMAIL */}

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              {/* PHONE */}

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              {/* PASSWORD */}

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

              {/* ROLE SELECT */}

              <div>

                <label className="
                  text-sm
                  font-semibold
                  text-gray-300
                  mb-2
                  block
                ">
                  Select Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    bg-white/[0.05]
                    border
                    border-white/10
                    px-5
                    text-white
                    outline-none
                  "
                >

                  <option
                    value="customer"
                    className="
                      bg-[#070b14]
                    "
                  >
                    Customer
                  </option>

                  <option
                    value="restaurant"
                    className="
                      bg-[#070b14]
                    "
                  >
                    Restaurant Owner
                  </option>

                  <option
                    value="driver"
                    className="
                      bg-[#070b14]
                    "
                  >
                    Driver
                  </option>

                </select>

              </div>

              {/* BUTTON */}

              <Button
                type="submit"
                loading={loading}
              >
                Send OTP
              </Button>

            </form>

          ) : (

            <form
              onSubmit={
                verifyOtpAndRegister
              }
              className="
                space-y-5
              "
            >

              <Input
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                  )
                }
                placeholder="Enter 6 digit OTP"
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

        {/* FOOTER */}
        <p className="
          text-center
          mt-8
          text-gray-400
        ">
          Already have an account?
          <Link
            to="/login"
            className="
              text-orange-400
              font-semibold
              ml-2
              hover:text-orange-300
            "
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;