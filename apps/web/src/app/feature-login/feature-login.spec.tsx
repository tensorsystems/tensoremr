import { render } from '@testing-library/react';

import FeatureLogin from './feature-login';

describe('FeatureLogin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureLogin />);
    expect(baseElement).toBeTruthy();
  });
});
