// components/ToastContainer.tsx
import { ToastContainer as ReactToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={5000} // Auto close after 5 seconds
      hideProgressBar={false}
      newestOnTop={true}
      closeButton
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastContainer;
