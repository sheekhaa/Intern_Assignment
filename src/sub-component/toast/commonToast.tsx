// CommonToast.tsx
import React from 'react';
import { EuiGlobalToastList } from '@elastic/eui';

export type MyToast = {
  id: string | number;
  title: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  iconType?: string;
  text?: React.ReactNode;
};

interface CommonToastProps {
  dismissToast: any;
  toastLifeTimeMs: number;
  toasts: any;
}

export const CommonToast: React.FC<CommonToastProps> = ({
  dismissToast,
  toastLifeTimeMs,
  toasts
}) => {
  return (
    <EuiGlobalToastList
      toasts={toasts}
      dismissToast={dismissToast}
      toastLifeTimeMs={toastLifeTimeMs}
    />
  );
};
