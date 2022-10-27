import { render } from '@testing-library/react';
import AdminAccountForm from './AdminAccountForm';
import OrganizationDetailsForm from './OrganizationDetailsForm';

describe('FeatureGetStarted', () => {
  it('should render organization form successfully', () => {
    const { baseElement } = render(
      <OrganizationDetailsForm
        onSubmit={() => console.log('OnSubmit')}
        isLoading={false}
      />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render admin form successfully', () => {
    const { baseElement } = render(
      <AdminAccountForm
        onSubmit={() => console.log('OnSubmit')}
        isLoading={false}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
