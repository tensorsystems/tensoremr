import { render } from '@testing-library/react';

import FeatureLabOrders from './feature-lab-orders';

describe('FeatureLabOrders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureLabOrders />);
    expect(baseElement).toBeTruthy();
  });
});
