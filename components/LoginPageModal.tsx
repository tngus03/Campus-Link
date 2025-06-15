'use client';

import ModalWrapper from './ModalWrapper';
import LoginPageContent from '@/app/(auth)/login/page';

export default function LoginPageModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper onClose={onClose}>
      <LoginPageContent />
    </ModalWrapper>
  );
}