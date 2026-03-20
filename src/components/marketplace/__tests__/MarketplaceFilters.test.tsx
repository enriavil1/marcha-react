import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';

import { marchaTheme } from '../../../design';
import MarketplaceFilters from '../MarketplaceFilters';

// Helper to capture search params from inside the router context
let capturedSearchParams: URLSearchParams = new URLSearchParams();

function SearchParamsCapture() {
  const [searchParams] = useSearchParams();
  capturedSearchParams = searchParams;
  return null;
}

const categories = [
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-2', name: 'Furniture' },
];

function renderFilters(initialEntries: string[] = ['/']) {
  return render(
    <ConfigProvider theme={marchaTheme}>
      <MemoryRouter initialEntries={initialEntries}>
        <SearchParamsCapture />
        <MarketplaceFilters categories={categories} />
      </MemoryRouter>
    </ConfigProvider>
  );
}

describe('MarketplaceFilters', () => {
  beforeEach(() => {
    capturedSearchParams = new URLSearchParams();
  });

  it('renders search input and category pill buttons', () => {
    renderFilters();
    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Furniture')).toBeInTheDocument();
  });

  it('populates search input from URL params', () => {
    renderFilters(['/?q=bike']);
    const input = screen.getByPlaceholderText('Search items...');
    expect(input).toHaveValue('bike');
  });

  it('updates the q search param when typing in the search input', async () => {
    renderFilters();
    const input = screen.getByPlaceholderText('Search items...');
    fireEvent.change(input, { target: { value: 'laptop' } });
    await waitFor(() => {
      expect(capturedSearchParams.get('q')).toBe('laptop');
    });
  });

  it('clears the cursor param when a filter changes', async () => {
    renderFilters(['/?q=old&cursor=abc123']);
    const input = screen.getByPlaceholderText('Search items...');
    fireEvent.change(input, { target: { value: 'new' } });
    await waitFor(() => {
      expect(capturedSearchParams.get('cursor')).toBeNull();
    });
  });

  it('sets category param when a category pill is clicked', async () => {
    renderFilters();
    fireEvent.click(screen.getByText('Electronics'));
    await waitFor(() => {
      expect(capturedSearchParams.get('category')).toBe('cat-1');
    });
  });

  it('clears category param when "All" pill is clicked', async () => {
    renderFilters(['/?category=cat-1']);
    fireEvent.click(screen.getByText('All'));
    await waitFor(() => {
      expect(capturedSearchParams.get('category')).toBeNull();
    });
  });
});
