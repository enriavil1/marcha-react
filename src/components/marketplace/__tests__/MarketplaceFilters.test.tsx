import { screen, fireEvent, waitFor, render } from '@testing-library/react';
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
    </ConfigProvider>,
  );
}

describe('MarketplaceFilters', () => {
  beforeEach(() => {
    capturedSearchParams = new URLSearchParams();
  });

  it('renders search input, category select, and condition select', () => {
    renderFilters();
    expect(
      screen.getByPlaceholderText('Search listings...'),
    ).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Condition')).toBeInTheDocument();
  });

  it('populates search input from URL params', () => {
    renderFilters(['/?q=bike']);
    const input = screen.getByPlaceholderText('Search listings...');
    expect(input).toHaveValue('bike');
  });

  it('updates the q search param when typing in the search input', async () => {
    renderFilters();
    const input = screen.getByPlaceholderText('Search listings...');
    fireEvent.change(input, { target: { value: 'laptop' } });
    await waitFor(() => {
      expect(capturedSearchParams.get('q')).toBe('laptop');
    });
  });

  it('clears the cursor param when a filter changes', async () => {
    renderFilters(['/?q=old&cursor=abc123']);
    const input = screen.getByPlaceholderText('Search listings...');
    fireEvent.change(input, { target: { value: 'new' } });
    await waitFor(() => {
      expect(capturedSearchParams.get('cursor')).toBeNull();
    });
  });

  it('shows Clear Filters button when filters are active', () => {
    renderFilters(['/?q=bike']);
    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).toBeInTheDocument();
  });

  it('does not show Clear Filters button when no filters are active', () => {
    renderFilters();
    expect(
      screen.queryByRole('button', { name: /clear filters/i }),
    ).not.toBeInTheDocument();
  });

  it('clears all params when Clear Filters is clicked', async () => {
    renderFilters(['/?q=bike&category=cat-1&condition=New']);
    fireEvent.click(
      screen.getByRole('button', { name: /clear filters/i }),
    );
    await waitFor(() => {
      expect(capturedSearchParams.get('q')).toBeNull();
      expect(capturedSearchParams.get('category')).toBeNull();
      expect(capturedSearchParams.get('condition')).toBeNull();
    });
  });
});
