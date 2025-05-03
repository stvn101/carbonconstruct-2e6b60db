
import { useRef, useEffect, useMemo, DependencyList } from 'react';
import { isEqual } from 'lodash-es';

/**
 * Custom hook for memoizing values with deep comparison
 * Prevents unnecessary re-renders when complex objects haven't changed
 */
export function useDeepCompareMemo<T>(factory: () => T, dependencies: DependencyList): T {
  const ref = useRef<DependencyList | undefined>(undefined);

  if (!ref.current || !isEqual(dependencies, ref.current)) {
    ref.current = dependencies;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, ref.current);
}

/**
 * Custom hook for handling effect with deep comparison of dependencies
 * Prevents unnecessary effect triggers when complex objects haven't changed
 */
export function useDeepCompareEffect(
  effect: React.EffectCallback,
  dependencies: DependencyList
): void {
  const ref = useRef<DependencyList | undefined>(undefined);

  if (!ref.current || !isEqual(dependencies, ref.current)) {
    ref.current = dependencies;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, ref.current);
}
