import { render } from '@testing-library/react';

import FeatureProfile from './feature-profile';

describe('FeatureProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureProfile />);
    expect(baseElement).toBeTruthy();
  });
});
