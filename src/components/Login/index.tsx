/* eslint-disable react/prop-types */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import UserContext from "../../../contexts/UserContext";
import CategoryContext from "../../../contexts/CategoryContext";
import { auth } from "../../../config/firebase-config";

interface loginResponse {
  isInitialUser: boolean;
  result: string;
}

function Login() {
  const { setUserCredentials } = useContext(UserContext);
  const { setInitialCategoryList } = useContext(CategoryContext);

  const navigate = useNavigate();

  async function handleGoogleLogin(): Promise<loginResponse> {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const idToken = await user.getIdToken();

      if (user.email) {
        setUserCredentials(idToken, user.email);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/login`,
        {
          email: user.email,
          idToken,
          login: true,
        }
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 401) {
          throw new Error("Unauthorized: Please check your login details");
        }

        if (err.response && err.response.status === 500) {
          throw new Error("Server error: Please try again later");
        }
      }

      throw new Error("An error occurred: Please try again");
    }
  }

  async function handleLogin() {
    try {
      const data = await handleGoogleLogin();

      if (data.isInitialUser) {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/initialSetting`
        );

        setInitialCategoryList(response.data.categories);
        navigate("/initial-resource-form", { state: { isInitialUser: true } });

        return;
      }

      if (data.result !== "OK") {
        toast.error("Login failed. Please try again.");
        navigate("/login");

        return;
      }

      navigate("/resource-list/BrandLogo");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.message);
        navigate("/login");
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-stone-100 drop-shadow-md rounded-lg w-96 h-52">
      <div>
        <h2 className="text-center mb-4 text-3xl font-bold">DBX</h2>
        <button
          type="button"
          onClick={handleLogin}
          className="block mx-auto mb-2.5 border border-black rounded-md bg-black text-1xl w-52 h-10 text-zinc-200"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
