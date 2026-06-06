import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { setUser } from "../../redux/slices/authslice";
import { useAppDispatch } from "../../redux/hooks";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await loginUser({ email, password });
      console.log(res);

     const { user, accessToken } = res;

if (user.role !== "admin") {
  alert("Access denied. Not an admin.");
  return;
}


localStorage.setItem("token", accessToken);
localStorage.setItem("role", user.role);


dispatch(setUser({ userId: user._id, role: user.role }));

navigate("/admin/users");
    } catch (err) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-950 border border-red-800 rounded-full px-3 py-1 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-semibold tracking-widest uppercase">
              Restricted Access
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-gray-500 text-sm mb-8">Authorized personnel only</p>

          {/* Fields */}
          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-widest py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-800">
            <span className="text-xs text-gray-600">© 2025 Admin System</span>
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}