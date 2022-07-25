import { render } from '@testing-library/react';

import FeatureEyeshopeHome from './feature-eyeshope-home';

describe('FeatureEyeshopeHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureEyeshopeHome />);
    expect(baseElement).toBeTruthy();
  });
});
