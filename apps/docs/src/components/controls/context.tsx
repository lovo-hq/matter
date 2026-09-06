'use client';

/**
 * Three contexts. ControlsProvider carries the page's store down to every
 * control. PathPrefixProvider is how list rows work: ListInput wraps each row
 * in a prefix like ['stops', 2], so the ColorInput inside that row can say
 * path="color" and land on stops[2].color without knowing its own index.
 * ListRowProvider carries the row's name ("stop 2") alongside, so a control
 * inside a row can drop its own visible label and still name itself fully
 * for a screen reader.
 */
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import type { ControlPath, ControlStore, PathSegment } from './store';

const StoreContext = createContext<ControlStore<object> | null>(null);
const PathPrefixContext = createContext<ControlPath>([]);

/**
 * Trail of ancestor row labels, outermost first ("line 5", then "stop 2").
 * Empty outside any list. Controls read it for two things: whether they are
 * inside a row at all, which switches them to their compact form, and how to
 * qualify their accessible names, since eight rows each holding a plain
 * "Color" would otherwise be indistinguishable to a screen reader. Only rows
 * contribute to the trail, never a list's own heading, so a nested list's
 * controls read "stop 2 from line 5" rather than "stop 2 from Colors from
 * line 5".
 */
const ListRowContext = createContext<readonly string[]>([]);

export function ControlsProvider({
  store,
  children,
}: {
  store: ControlStore<object>;
  children: ReactNode;
}) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function PathPrefixProvider({
  segments,
  children,
}: {
  segments: readonly PathSegment[];
  children: ReactNode;
}) {
  const parent = useContext(PathPrefixContext);
  // Keyed on the segments themselves (via JSON.stringify, not join('.') --
  // a segment could itself contain a dot and collide with a different path)
  // so a row keeps one prefix identity across re-renders; a fresh array each
  // render would defeat the memo in useResolvedPath and make every path read
  // a new subscription.
  const prefix = useMemo(
    () => [...parent, ...segments],
    [parent, JSON.stringify(segments)], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <PathPrefixContext.Provider value={prefix}>{children}</PathPrefixContext.Provider>;
}

export function ListRowProvider({
  trail,
  children,
}: {
  trail: readonly string[];
  children: ReactNode;
}) {
  // Keyed on the labels themselves so a row keeps one trail identity across
  // re-renders, the same way PathPrefixProvider keeps its prefix.
  const value = useMemo(
    () => trail,
    [JSON.stringify(trail)], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <ListRowContext.Provider value={value}>{children}</ListRowContext.Provider>;
}

export function useListRowTrail(): readonly string[] {
  return useContext(ListRowContext);
}

export function useControlStore(): ControlStore<object> {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error('Control components must be rendered inside <ControlsProvider>.');
  }

  return store;
}

export function usePathPrefix(): ControlPath {
  return useContext(PathPrefixContext);
}
