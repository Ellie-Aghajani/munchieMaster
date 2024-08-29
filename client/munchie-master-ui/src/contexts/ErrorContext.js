import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert, Typography } from '@mui/material';

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const showError = (data, message) => {
    setError({ data, message });
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          <Typography variant="body1">{error?.message}</Typography>
          {error?.data && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Details: {JSON.stringify(error.data)}
            </Typography>
          )}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}