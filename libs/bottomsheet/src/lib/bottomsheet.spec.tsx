import { render } from '@testing-library/react';

import Bottomsheet from './bottomsheet';

describe('Bottomsheet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Bottomsheet />);
    expect(baseElement).toBeTruthy();
  });
});
