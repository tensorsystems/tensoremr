import { render } from '@testing-library/react';
import TestComponents from './test-components';

describe('TestComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TestComponents />);
    expect(baseElement).toBeTruthy();
  });
});
