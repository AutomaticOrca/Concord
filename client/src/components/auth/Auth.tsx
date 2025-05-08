"use client";

import { useState } from "react";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7]">
      <div className="w-full max-w-md bg-white border border-[#95D5B2] shadow-xl rounded-2xl p-10">
        {isLogin ? <Login /> : <Register />}

        <div className="mt-6 text-center text-sm text-gray-700">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#2D6A4F] font-medium hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#2D6A4F] font-medium hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
