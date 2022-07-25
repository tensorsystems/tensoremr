import { render } from '@testing-library/react';

import FeaturePatients from './feature-patients';

describe('FeaturePatients', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturePatients />);
    expect(baseElement).toBeTruthy();
  });
});
