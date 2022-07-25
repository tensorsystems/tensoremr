import { render } from '@testing-library/react';

import FeaturePharmacyHome from './feature-pharmacy-home';

describe('FeaturePharmacyHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturePharmacyHome />);
    expect(baseElement).toBeTruthy();
  });
});
