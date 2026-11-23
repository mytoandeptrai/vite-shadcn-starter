import { type DependencyList, useEffect, useMemo } from 'react';

/**
 * A GPU resource (texture, geometry) built once per `deps` and freed when it is replaced or the
 * component unmounts: React Three Fiber only disposes what is declared as JSX, not what a prop points to.
 */
export function useDisposable<T extends { dispose(): void }>(create: () => T, deps: DependencyList): T {
  // biome-ignore lint/correctness/useExhaustiveDependencies: the caller lists what `create` reads
  const resource = useMemo(create, deps);
  useEffect(() => () => resource.dispose(), [resource]);
  return resource;
}
