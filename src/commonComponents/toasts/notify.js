import { toast } from 'react-toastify';

const defaultOptions = {
  success: { autoClose: 3500 },
  error: { autoClose: 6000 },
  info: { autoClose: 4500 },
  warning: { autoClose: 5000 },
};

export const notify = {
  success: (message, options) => toast.success(message, { ...defaultOptions.success, ...options }),
  error: (message, options) => toast.error(message, { ...defaultOptions.error, ...options }),
  info: (message, options) => toast.info(message, { ...defaultOptions.info, ...options }),
  warning: (message, options) => toast.warning(message, { ...defaultOptions.warning, ...options }),
  loading: (message, options) => toast.loading(message, options),
  update: (id, options) => toast.update(id, options),
  dismiss: (id) => toast.dismiss(id),
  promise: (promise, messages, options) => toast.promise(promise, messages, options),
};
