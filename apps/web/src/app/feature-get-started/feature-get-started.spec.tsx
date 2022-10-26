import { render } from '@testing-library/react';
import { OrganizationDetailsForm } from './OrganizationDetailsForm';


describe('FeatureGetStarted', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <OrganizationDetailsForm
        organizationTypes={undefined}
        isLoading={false}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
