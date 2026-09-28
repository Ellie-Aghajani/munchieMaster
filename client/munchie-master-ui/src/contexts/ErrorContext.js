import React, { createContext, useState, useContext, useCallback } from 'react';
import { Snackbar, Alert, Typography } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useTranslation } from 'react-i18next';

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const { t } = useTranslation();
  const [notice, setNotice] = useState(null);

  const showError = useCallback((data, message) => {
    setNotice({ severity: 'error', data, message });
  }, []);

  // Positive messages, e.g. coins earned or spent
  const showSuccess = useCallback((message) => {
    setNotice({ severity: 'success', message });
  }, []);

  const close = () => setNotice(null);

  return (
    <ErrorContext.Provider value={{ showError, showSuccess }}>
      {children}
      <Snackbar
        open={!!notice}
        autoHideDuration={6000}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={close}
          severity={notice?.severity || 'error'}
          variant={notice?.severity === 'success' ? 'filled' : 'standard'}
          icon={notice?.severity === 'success' ? <MonetizationOnIcon /> : undefined}
          sx={{ width: '100%', alignItems: 'center' }}
        >
          <Typography variant="body1">{notice?.message}</Typography>
          {notice?.data && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('errors.details')} {JSON.stringify(notice.data)}
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
