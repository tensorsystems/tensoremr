import { render } from '@testing-library/react';

import FeatureSurgicalOrders from './feature-surgical-orders';

describe('FeatureSurgicalOrders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureSurgicalOrders />);
    expect(baseElement).toBeTruthy();
  });
});
