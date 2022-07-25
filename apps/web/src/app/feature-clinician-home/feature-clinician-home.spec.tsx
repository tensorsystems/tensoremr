import { render } from '@testing-library/react';

import FeatureClinicianHome from './feature-clinician-home';

describe('FeatureClinicianHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureClinicianHome />);
    expect(baseElement).toBeTruthy();
  });
});
