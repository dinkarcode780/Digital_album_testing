import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyInvite } from "../../app/invite/inviteThunk";
import { toast } from "react-toastify";

const InvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleContinue = async () => {
    const result = await dispatch(verifyInvite(token));

    if (verifyInvite.fulfilled.match(result)) {
      toast.success(result.payload.message);

      navigate("/users/register", {
        state: {
          inviteToken: token,
          inviteData: result.payload.data,
        },
      });
    } else {
      toast.error(result.payload?.message || "Invalid Invite Link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-600">
          Wedding Invitation
        </h1>

        <p className="mt-4 text-gray-600">
          You have been invited to access your wedding album.
        </p>

        <button
          onClick={handleContinue}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default InvitePage;