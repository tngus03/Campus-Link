'use client';

import ModalWrapper from './ModalWrapper';
import CreateAccountPage from '@/app/(auth)/create-account/page';

export default function SignupPageModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper onClose={onClose}>
      <CreateAccountPage />
    </ModalWrapper>
  );
}
