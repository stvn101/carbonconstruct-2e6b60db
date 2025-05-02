
import { describe, test, expect } from 'vitest';
import { getPayloadConfig } from '../getPayloadConfig';

describe('getPayloadConfig', () => {
  test('returns proper configuration for a payload item', () => {
    const mockConfig = {
      sales: { label: 'Sales', color: '#3e9847' },
      revenue: { label: 'Revenue', color: '#25612d' }
    };
    
    const mockPayloadItem = {
      dataKey: 'sales',
      value: 1500,
      color: '#3e9847',
      name: 'Sales'
    };
    
    const result = getPayloadConfig(mockPayloadItem, mockConfig);
    
    expect(result).toEqual({
      key: 'sales',
      value: 1500,
      label: 'Sales',
      color: '#3e9847'
    });
  });
  
  test('uses value as label when no config found', () => {
    const mockConfig = {
      sales: { label: 'Sales', color: '#3e9847' }
    };
    
    const mockPayloadItem = {
      dataKey: 'revenue',
      value: 2000,
      color: '#25612d',
      name: 'Revenue'
    };
    
    const result = getPayloadConfig(mockPayloadItem, mockConfig);
    
    expect(result).toEqual({
      key: 'revenue',
      value: 2000,
      label: 'Revenue',
      color: '#25612d'
    });
  });
  
  test('handles missing dataKey', () => {
    const mockConfig = {
      sales: { label: 'Sales', color: '#3e9847' }
    };
    
    const mockPayloadItem = {
      value: 2000,
      color: '#25612d',
      name: 'Revenue'
    };
    
    const result = getPayloadConfig(mockPayloadItem, mockConfig);
    
    expect(result).toEqual({
      key: undefined,
      value: 2000,
      label: 'Revenue',
      color: '#25612d'
    });
  });
});
