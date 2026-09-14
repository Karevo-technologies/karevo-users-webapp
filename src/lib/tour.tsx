/**
 * Backward-compatible re-export of the dashboard tour.
 *
 * The tour engine now lives in `src/dashboard/_components/DashboardTour.tsx`
 * (spotlights `data-tour` targets, responsive step filtering, localStorage
 * first-visit gate). This file keeps old `@/lib/tour` imports working.
 */
// eslint-disable-next-line react-refresh/only-export-components
export { TourProvider, useTour, TOUR_DONE_KEY } from "../dashboard/_components/DashboardTour";

