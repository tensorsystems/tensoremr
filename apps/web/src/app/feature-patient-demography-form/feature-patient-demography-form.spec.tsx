import { render } from '@testing-library/react';

import { PatientDemographyForm } from './feature-patient-demography-form';

describe('FeaturePatientRegistration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PatientDemographyForm onAddPage={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
