import PropTypes from "prop-types";

function Login({ handleGoogleLogin }) {
  return (
    <div>
      <h2>DBX</h2>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="border border-black"
      >
        Login with Google
      </button>
    </div>
  );
}

Login.propTypes = {
  handleGoogleLogin: PropTypes.func,
};

Login.defaultProps = {
  handleGoogleLogin: () => {},
};

export default Login;
