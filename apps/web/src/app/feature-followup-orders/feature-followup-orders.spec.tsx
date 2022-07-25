import { render } from '@testing-library/react';

import FeatureFollowupOrders from './feature-followup-orders';

describe('FeatureFollowupOrders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureFollowupOrders />);
    expect(baseElement).toBeTruthy();
  });
});
