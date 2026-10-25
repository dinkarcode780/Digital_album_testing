import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaPhoneAlt, FaEnvelope, FaPaperPlane, FaCamera } from "react-icons/fa";
import {
  userForgetPassword,
  userResetPassword,
} from "../../app/auth/authThunk";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const [resetType, setResetType] = useState("mobile");
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (resetType === "mobile") {
    //   toast.error("Mobile OTP is not supported yet. Please use Email reset.");
    //   return;
    // }

    // if (!formData.email) {
    //   toast.error("Please enter your email address.");
    //   return;
    // }

    if (resetType === "email" && !formData.email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (resetType === "mobile" && !formData.phoneNumber) {
      toast.error("Please enter your mobile number.");
      return;
    }

    if (step === "request") {
      try {
        setLoading(true);
        // const result = await dispatch(userForgetPassword(formData.email));
        const payload =
          resetType === "email"
            ? { email: formData.email }
            : { phoneNumber: formData.phoneNumber };

        const result = await dispatch(userForgetPassword(payload));

        if (userForgetPassword.fulfilled.match(result)) {
          toast.success(
            result.payload.message || "Password reset OTP sent to your email.",
          );
          setStep("verify");
        } else {
          toast.error(
            result.payload?.message || "Unable to send password reset OTP.",
          );
        }
      } catch (error) {
        toast.error("Something went wrong while sending the reset OTP.");
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!otp) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password must match.");
      return;
    }

    try {
      setLoading(true);
      // const result = await dispatch(
      //   userResetPassword({
      //     email: formData.email,
      //     otp,
      //     newPassword,
      //   }),
      // );

      const result = await dispatch(
        userResetPassword({
          email: resetType === "email" ? formData.email : undefined,
          phoneNumber:
            resetType === "mobile" ? formData.phoneNumber : undefined,
          otp,
          newPassword,
        }),
      );

      if (userResetPassword.fulfilled.match(result)) {
        toast.success(result.payload.message || "Password reset successfully.");
        setStep("request");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.payload?.message || "Unable to reset password.");
      }
    } catch (error) {
      toast.error("Something went wrong while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left */}

      <div className="hidden lg:flex relative">
        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white px-10">
          <FaCamera className="text-7xl mb-6" />

          <h1 className="text-5xl font-bold">Album Studio</h1>

          <p className="mt-5 text-center text-lg max-w-md">
            Forgot your password? Reset it easily using your registered Mobile
            Number or Email Address.
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Forgot Password</h2>

            <p className="text-gray-500 mt-2">
              Choose how you want to reset your password
            </p>
          </div>

          {/* Tabs */}

          <div className="mt-8">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setResetType("mobile")}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  resetType === "mobile"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                📱 Mobile
              </button>

              <button
                type="button"
                onClick={() => setResetType("email")}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  resetType === "email"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                ✉️ Email
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {resetType === "mobile" ? (
              <div>
                <label className="font-semibold">Mobile Number</label>

                <div className="relative mt-2">
                  <FaPhoneAlt className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="Enter Mobile Number"
                    className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="font-semibold">Email Address</label>

                <div className="relative mt-2">
                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter Email Address"
                    className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            )}

            {step === "verify" && (
              <>
                <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
                  <p className="text-sm text-purple-700">
                    OTP has been sent to your{" "}
                    {resetType === "email" ? "email" : "mobile number"}. Enter
                    it below and set a new password.
                  </p>
                </div>

                <div>
                  <label className="font-semibold">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6}
                    className="w-full border rounded-xl py-3 px-4 mt-2 outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="font-semibold">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    className="w-full border rounded-xl py-3 px-4 mt-2 outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="font-semibold">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full border rounded-xl py-3 px-4 mt-2 outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition disabled:opacity-50"
            >
              <FaPaperPlane />

              {loading
                ? step === "request"
                  ? "Sending..."
                  : "Submitting..."
                : step === "request"
                  ? "Send Reset OTP"
                  : "Submit OTP & Reset"}
            </button>

            <div className="text-center">
              <Link
                to="/"
                className="text-purple-600 font-semibold hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
