import { render } from '@testing-library/react';

import Models from './models';

describe('Models', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Models />);
    expect(baseElement).toBeTruthy();
  });
});
