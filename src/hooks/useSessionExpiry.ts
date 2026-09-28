import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSession } from '../store/selectors';
import { isSessionExpired, logout } from '../store/slices/authSlice';

export const useSessionExpiry = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession);

  useEffect(() => {
    if (!session) {
      return;
    }
    const expire = () => dispatch(logout('expired'));

    const timer = setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && isSessionExpired(session)) {
        expire();
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [session, dispatch]);
};
