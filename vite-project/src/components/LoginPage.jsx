import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Login</h1>
        <p className="mb-8 text-sm text-slate-600">
          Access your account to review orders and manage your cart.
        </p>

        <form className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c]"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#4a7c23] hover:text-[#3d6a1c]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
