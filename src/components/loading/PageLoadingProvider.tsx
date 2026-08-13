"use client";

import { usePathname, useRouter as useNextRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { ServiceUnavailable } from "@/components/errors/ServiceUnavailable";
import { SlowLoadingNotice } from "@/components/errors/SlowLoadingNotice";
import { EvadaPageLoader } from "./EvadaPageLoader";

const HYDRATION_TASK = "app-hydration";
const MINIMUM_ANIMATION_TASK = "minimum-animation";
const NAVIGATION_TASK = "route-navigation";
const LOADER_COMPLETION_MS = 220;
const MINIMUM_ANIMATION_MS = 600;
const ROUTE_PROGRESS_DELAY_MS = 250;
const ROUTE_NAVIGATION_TIMEOUT_MS = 15_000;
const SLOW_LOADING_MS = 10_000;
const LOADING_TIMEOUT_MS = 30_000;
const AUTH_FLOW_PATHS = new Set([
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/access/setup",
  "/activate-account",
]);
const INLINE_INITIAL_PATHS = new Set([
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/access/setup",
  "/activate-account",
]);
const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/activity-log",
  "/ai-pentester",
  "/assets",
  "/billing",
  "/findings",
  "/network-agent",
  "/notifications",
  "/reports",
  "/scans",
  "/team",
];

type PageLoadingContextValue = {
  startNavigation: (href?: string) => void;
  setTaskPending: (task: string, pending: boolean) => void;
};

type LoadingState = {
  cycleKey: number;
  completionKey: number;
  completionVisible: boolean;
  pendingTasks: Set<string>;
};

type LoadingAction =
  | { type: "set-task"; task: string; pending: boolean }
  | { type: "hide-completion"; completionKey: number };

function normalizePath(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function createInitialLoadingState(pathname: string): LoadingState {
  const showInitialLoader = !INLINE_INITIAL_PATHS.has(normalizePath(pathname));
  return {
    cycleKey: 1,
    completionKey: 0,
    completionVisible: false,
    pendingTasks: showInitialLoader ? new Set([HYDRATION_TASK, MINIMUM_ANIMATION_TASK]) : new Set(),
  };
}

function isInlineAuthTransition(sourcePath: string, destinationPath: string) {
  return AUTH_FLOW_PATHS.has(normalizePath(sourcePath)) && AUTH_FLOW_PATHS.has(normalizePath(destinationPath));
}

function isProtectedPath(pathname: string) {
  const normalizedPath = normalizePath(pathname);
  return PROTECTED_PATH_PREFIXES.some((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`));
}

function shouldShowFullScreenNavigationLoader(sourcePath: string, destinationPath: string) {
  if (isInlineAuthTransition(sourcePath, destinationPath)) return false;
  const sourceIsProtected = isProtectedPath(sourcePath);
  const destinationIsProtected = isProtectedPath(destinationPath);
  const sourceIsAuth = AUTH_FLOW_PATHS.has(normalizePath(sourcePath));
  const destinationIsAuth = AUTH_FLOW_PATHS.has(normalizePath(destinationPath));

  return (sourceIsAuth && destinationIsProtected) || (sourceIsProtected && destinationIsAuth);
}

function loadingReducer(state: LoadingState, action: LoadingAction): LoadingState {
  if (action.type === "hide-completion") {
    if (action.completionKey !== state.completionKey) return state;
    return { ...state, completionVisible: false };
  }

  const currentlyPending = state.pendingTasks.has(action.task);
  if (currentlyPending === action.pending) return state;

  const wasActive = state.pendingTasks.size > 0;
  const startsNewCycle = action.pending && !wasActive && action.task !== MINIMUM_ANIMATION_TASK;
  const pendingTasks = new Set(state.pendingTasks);

  if (startsNewCycle) pendingTasks.add(MINIMUM_ANIMATION_TASK);
  if (action.pending) pendingTasks.add(action.task);
  else pendingTasks.delete(action.task);

  const isActive = pendingTasks.size > 0;
  const completed = wasActive && !isActive;

  return {
    cycleKey: startsNewCycle ? state.cycleKey + 1 : state.cycleKey,
    pendingTasks,
    completionKey: completed ? state.completionKey + 1 : state.completionKey,
    completionVisible: completed,
  };
}

const PageLoadingContext = createContext<PageLoadingContextValue | null>(null);

function isModifiedClick(event: MouseEvent | ReactMouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function PageLoadingProvider({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [loadingState, dispatchLoading] = useReducer(loadingReducer, pathname, createInitialLoadingState);
  const [slowCycle, setSlowCycle] = useState<number | null>(null);
  const [dismissedSlowCycle, setDismissedSlowCycle] = useState<number | null>(null);
  const [timedOutCycle, setTimedOutCycle] = useState<number | null>(null);
  const [routeProgressVisible, setRouteProgressVisible] = useState(false);
  const navigationFrom = useRef<string | null>(null);
  const navigationWatchdog = useRef<number | null>(null);
  const routeNavigationFrom = useRef<string | null>(null);
  const routeProgressTimer = useRef<number | null>(null);
  const routeNavigationWatchdog = useRef<number | null>(null);

  const setTaskPending = useCallback((task: string, pending: boolean) => {
    dispatchLoading({ type: "set-task", task, pending });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatchLoading({ type: "set-task", task: MINIMUM_ANIMATION_TASK, pending: false });
    }, MINIMUM_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [loadingState.cycleKey]);

  useEffect(() => {
    if (!loadingState.completionVisible) return;
    const completionKey = loadingState.completionKey;
    const timer = window.setTimeout(() => {
      dispatchLoading({ type: "hide-completion", completionKey });
    }, LOADER_COMPLETION_MS);
    return () => window.clearTimeout(timer);
  }, [loadingState.completionKey, loadingState.completionVisible]);

  useEffect(() => {
    if (loadingState.pendingTasks.size === 0) return;
    const cycleKey = loadingState.cycleKey;
    const slowTimer = window.setTimeout(() => setSlowCycle(cycleKey), SLOW_LOADING_MS);
    const timeoutTimer = window.setTimeout(() => setTimedOutCycle(cycleKey), LOADING_TIMEOUT_MS);
    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, [loadingState.cycleKey, loadingState.pendingTasks.size]);

  const startNavigation = useCallback((href?: string) => {
    if (typeof window === "undefined") return;

    if (href) {
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      if (!shouldShowFullScreenNavigationLoader(window.location.pathname, destination.pathname)) {
        if (!isProtectedPath(window.location.pathname) || !isProtectedPath(destination.pathname)) return;

        routeNavigationFrom.current = window.location.pathname;
        if (routeProgressTimer.current !== null) window.clearTimeout(routeProgressTimer.current);
        if (routeNavigationWatchdog.current !== null) window.clearTimeout(routeNavigationWatchdog.current);
        routeProgressTimer.current = window.setTimeout(() => setRouteProgressVisible(true), ROUTE_PROGRESS_DELAY_MS);
        routeNavigationWatchdog.current = window.setTimeout(() => {
          routeNavigationFrom.current = null;
          setRouteProgressVisible(false);
        }, ROUTE_NAVIGATION_TIMEOUT_MS);
        return;
      }
    }

    navigationFrom.current = window.location.pathname;
    setTaskPending(NAVIGATION_TASK, true);
    if (navigationWatchdog.current !== null) window.clearTimeout(navigationWatchdog.current);
    navigationWatchdog.current = window.setTimeout(() => {
      navigationFrom.current = null;
      setTaskPending(NAVIGATION_TASK, false);
    }, 60_000);
  }, [setTaskPending]);

  useEffect(() => {
    let frameId: number | null = null;
    const finishHydration = () => {
      frameId = window.requestAnimationFrame(() => setTaskPending(HYDRATION_TASK, false));
    };
    if (document.readyState === "complete") finishHydration();
    else window.addEventListener("load", finishHydration, { once: true });
    return () => {
      window.removeEventListener("load", finishHydration);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [setTaskPending]);

  useEffect(() => {
    if (navigationFrom.current === null || navigationFrom.current === pathname) return;
    navigationFrom.current = null;
    if (navigationWatchdog.current !== null) {
      window.clearTimeout(navigationWatchdog.current);
      navigationWatchdog.current = null;
    }
    queueMicrotask(() => setTaskPending(NAVIGATION_TASK, false));
  }, [pathname, setTaskPending]);

  useEffect(() => {
    if (routeNavigationFrom.current === null || routeNavigationFrom.current === pathname) return;
    routeNavigationFrom.current = null;
    if (routeProgressTimer.current !== null) {
      window.clearTimeout(routeProgressTimer.current);
      routeProgressTimer.current = null;
    }
    if (routeNavigationWatchdog.current !== null) {
      window.clearTimeout(routeNavigationWatchdog.current);
      routeNavigationWatchdog.current = null;
    }
    queueMicrotask(() => setRouteProgressVisible(false));
  }, [pathname]);

  useEffect(() => () => {
    if (navigationWatchdog.current !== null) window.clearTimeout(navigationWatchdog.current);
    if (routeProgressTimer.current !== null) window.clearTimeout(routeProgressTimer.current);
    if (routeNavigationWatchdog.current !== null) window.clearTimeout(routeNavigationWatchdog.current);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) return;
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.dataset.pageLoader === "off") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      startNavigation(anchor.href);
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [startNavigation]);

  const value = useMemo(() => ({ startNavigation, setTaskPending }), [setTaskPending, startNavigation]);
  const loadingActive = loadingState.pendingTasks.size > 0;
  const showSlowLoading = loadingActive && slowCycle === loadingState.cycleKey && dismissedSlowCycle !== loadingState.cycleKey;
  const showLoadingTimeout = loadingActive && timedOutCycle === loadingState.cycleKey;

  const leaveInterruptedFlow = () => {
    const safeDestination = isProtectedPath(window.location.pathname) ? "/login" : "/";
    window.location.assign(safeDestination);
  };

  return (
    <PageLoadingContext.Provider value={value}>
      {children}
      {routeProgressVisible && !loadingActive ? (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[9998] h-0.5 overflow-hidden bg-[#071010]/10" role="progressbar" aria-label="Loading workspace page">
          <span className="evada-route-progress block h-full bg-[#2ECE82] shadow-[0_0_12px_rgba(46,206,130,0.72)]" />
        </div>
      ) : null}
      {showLoadingTimeout ? (
        <div className="fixed inset-0 z-[9999] overflow-hidden" data-evada-error-overlay>
          <ServiceUnavailable
            reference={`EVT-${loadingState.cycleKey.toString().padStart(4, "0")}`}
            onRetry={() => window.location.reload()}
            onCancel={leaveInterruptedFlow}
          />
        </div>
      ) : showSlowLoading ? (
        <div className="fixed inset-0 z-[9999] overflow-hidden" data-evada-error-overlay>
          <SlowLoadingNotice
            onContinue={() => setDismissedSlowCycle(loadingState.cycleKey)}
            onCancel={leaveInterruptedFlow}
          />
        </div>
      ) : loadingActive || loadingState.completionVisible ? (
        <EvadaPageLoader key={loadingState.cycleKey} complete={!loadingActive} />
      ) : null}
    </PageLoadingContext.Provider>
  );
}

function usePageLoading() {
  const value = useContext(PageLoadingContext);
  if (!value) throw new Error("Page loading hooks must be used inside PageLoadingProvider.");
  return value;
}

export function usePageLoadingTask(task: string, pending: boolean) {
  const { setTaskPending } = usePageLoading();

  useEffect(() => {
    setTaskPending(task, pending);
    return () => setTaskPending(task, false);
  }, [pending, setTaskPending, task]);
}

export function useLoadingRouter() {
  const router = useNextRouter();
  const { startNavigation } = usePageLoading();

  const push = useCallback<typeof router.push>((href, options) => {
    startNavigation(href);
    router.push(href, options);
  }, [router, startNavigation]);

  const replace = useCallback<typeof router.replace>((href, options) => {
    startNavigation(href);
    router.replace(href, options);
  }, [router, startNavigation]);

  return useMemo(() => ({ ...router, push, replace }), [push, replace, router]);
}
