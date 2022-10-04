import { render } from '@testing-library/react';

import ConfirmationModal from './confirmation-modal';

describe('ConfirmationModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConfirmationModal />);
    expect(baseElement).toBeTruthy();
  });
});
