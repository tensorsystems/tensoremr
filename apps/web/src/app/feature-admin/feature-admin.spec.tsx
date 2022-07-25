import { render } from '@testing-library/react';

import FeatureAdmin from './feature-admin';

describe('FeatureAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureAdmin />);
    expect(baseElement).toBeTruthy();
  });
});
