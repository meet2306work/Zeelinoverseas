import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      pauseOnFocusLoss
      pauseOnHover
      draggable
      theme="light"
      toastClassName="zeelin-toast"
      progressClassName="zeelin-toast-progress"
    />
  );
}
