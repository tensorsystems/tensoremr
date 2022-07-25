import { render } from '@testing-library/react';

import FeaturePatientQueue from './feature-patient-queue';

describe('FeaturePatientQueue', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturePatientQueue />);
    expect(baseElement).toBeTruthy();
  });
});
