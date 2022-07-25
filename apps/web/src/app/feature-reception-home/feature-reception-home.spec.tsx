import { render } from '@testing-library/react';

import FeatureReceptionHome from './feature-reception-home';

describe('FeatureReceptionHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureReceptionHome />);
    expect(baseElement).toBeTruthy();
  });
});
