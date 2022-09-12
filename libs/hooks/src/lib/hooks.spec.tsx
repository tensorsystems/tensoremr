import { render } from '@testing-library/react';

import Hooks from './hooks';

describe('Hooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Hooks />);
    expect(baseElement).toBeTruthy();
  });
});
