import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import useUser from "../../../hooks/useUser";
import { InitialResponseContext } from "../../../contexts/InitialResponseContext";

function Login() {
  const user = useUser();
  const navigate = useNavigate();
  const { initialResponse, setInitialResponse } = useContext(
    InitialResponseContext
  );

  async function handleLogin() {
    try {
      const data = await user.handleGoogleLogin();

      if (data?.isInitialUser) {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/initialSetting`
        );

        setInitialResponse(response.data);
        navigate("/new-resource-form", { state: { isInitialUser: true } });

        return;
      }

      if (data.result !== "OK") {
        toast.error("Login failed. Please try again.");
        navigate("/login");

        return;
      }

      const brandLogoCategory = initialResponse?.find(
        category => category.name === "BrandLogo"
      );
      const brandLogoCategoryId = brandLogoCategory
        ? brandLogoCategory._id
        : null;

      navigate(`/resource-list/${brandLogoCategoryId}`);
    } catch (err) {
      toast.error(err.message);
      navigate("/login");
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
        <button
          type="button"
          onClick={handleLogin}
          className="block mx-auto mb-4 border border-black w-52 rounded-md h-9 text-1xl"
        >
          Guest Mode
        </button>
        <p className="text-xs text-stone-400">
          Not your computer? Use Guest mode to sign in privately.
        </p>
      </div>
    </div>
  );
}

export default Login;
