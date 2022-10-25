import { render } from '@testing-library/react';

import FeatureGetStarted from './feature-get-started';

describe('FeatureGetStarted', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureGetStarted />);
    expect(baseElement).toBeTruthy();
  });
});
