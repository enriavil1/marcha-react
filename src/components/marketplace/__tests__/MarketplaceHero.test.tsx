import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderWithAntd } from '../../../test-utils';
import MarketplaceHero from '../MarketplaceHero';

describe('MarketplaceHero', () => {
  it('renders the title and subtitle', () => {
    renderWithAntd(<MarketplaceHero onPostListing={jest.fn()} />);
    expect(screen.getByText('Community Marketplace')).toBeInTheDocument();
    expect(
      screen.getByText('Buy and sell items within your community'),
    ).toBeInTheDocument();
  });

  it('renders the Post Listing button', () => {
    renderWithAntd(<MarketplaceHero onPostListing={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /post listing/i }),
    ).toBeInTheDocument();
  });

  it('calls onPostListing when the button is clicked', () => {
    const onPostListing = jest.fn();
    renderWithAntd(<MarketplaceHero onPostListing={onPostListing} />);
    fireEvent.click(screen.getByRole('button', { name: /post listing/i }));
    expect(onPostListing).toHaveBeenCalledTimes(1);
  });
});
