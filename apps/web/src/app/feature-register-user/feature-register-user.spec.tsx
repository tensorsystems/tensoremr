import { render } from '@testing-library/react';

import FeatureRegisterUser from './feature-register-user';

describe('FeatureRegisterUser', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureRegisterUser />);
    expect(baseElement).toBeTruthy();
  });
});
