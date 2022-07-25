import { render } from '@testing-library/react';

import FeatureDiagnosticOrders from './feature-diagnostic-orders';

describe('FeatureDiagnosticOrders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureDiagnosticOrders />);
    expect(baseElement).toBeTruthy();
  });
});
