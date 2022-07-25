import { render } from '@testing-library/react';

import FeatureChats from './feature-chats';

describe('FeatureChats', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureChats />);
    expect(baseElement).toBeTruthy();
  });
});
