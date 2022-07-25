import { render } from '@testing-library/react';

import FeatureReferralOrders from './feature-referral-orders';

describe('FeatureReferralOrders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureReferralOrders />);
    expect(baseElement).toBeTruthy();
  });
});
