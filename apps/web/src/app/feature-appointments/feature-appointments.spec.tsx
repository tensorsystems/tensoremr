import { render } from '@testing-library/react';

import FeatureAppointments from './feature-appointments';

describe('FeatureAppointments', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureAppointments />);
    expect(baseElement).toBeTruthy();
  });
});
