import { render } from '@testing-library/react';

import FeatureUpdatePatient from './feature-update-patient';

describe('FeatureUpdatePatient', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureUpdatePatient />);
    expect(baseElement).toBeTruthy();
  });
});
