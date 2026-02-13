"use client";

import { useRouter } from "@/i18n/routing";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1f1a]">
      <div className="w-80 rounded-2xl bg-[#102a23] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-white">
          Create account
        </h1>

        <input
          placeholder="Full name"
          className="mb-3 w-full rounded-xl border border-[#1f4f43] bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded-xl border border-[#1f4f43] bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-5 w-full rounded-xl border border-[#1f4f43] bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
        />

        <button
          onClick={() => router.push("/login")}
          className="w-full rounded-xl bg-[#0F5D4A] py-3 text-white"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
