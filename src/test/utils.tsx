
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { CalculatorProvider } from '@/contexts/calculator';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { RegionProvider } from '@/contexts/RegionContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <CalculatorProvider>
          <ProjectProvider>
            <RegionProvider>
              {children}
            </RegionProvider>
          </ProjectProvider>
        </CalculatorProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
