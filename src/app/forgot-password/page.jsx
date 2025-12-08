"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setSending(true);

    try {
      await sendPasswordResetEmail(auth, email);

      toast.success("Reset link sent! Check Inbox & Spam folder.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.log(err);

      toast.error(
        err.code === "auth/user-not-found"
          ? "No account exists with this email"
          : "Failed to send reset email"
      );
    }

    setSending(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-[url('/tajmahal_bg.jpg')] bg-cover bg-center px-6">
      <div className="rounded-3xl shadow-2xl border border-white p-10 w-full max-w-md bg-white/80 text-center animate-fade-in">
        {/* Heading */}
        <h3 className="text-5xl font-extrabold mb-8">Reset Password</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* EMAIL FIELD */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="email"
              placeholder="Registered Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-xl rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
              required
            />
          </div>

          {/* SEND BUTTON */}
          <button
            type="submit"
            disabled={sending}
            className="w-full text-2xl tracking-widest bg-[url('/bg_2_cropped.jpg')] bg-cover bg-bottom rounded-xl text-white py-2 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Reset"}
          </button>
        </form>

        {/* Back to login */}
        <p className="mt-6 text-lg text-gray-700">
          Remember your password?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#095DB7] font-semibold text-xl cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
