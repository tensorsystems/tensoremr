import { render } from '@testing-library/react';

import FeatureTreatmentOrders from './feature-treatment-orders';

describe('FeatureTreatmentOrders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureTreatmentOrders />);
    expect(baseElement).toBeTruthy();
  });
});
