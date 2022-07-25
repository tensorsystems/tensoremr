import { render } from '@testing-library/react';

import FeaturePatientRegistration from './feature-patient-registration';

describe('FeaturePatientRegistration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturePatientRegistration />);
    expect(baseElement).toBeTruthy();
  });
});
