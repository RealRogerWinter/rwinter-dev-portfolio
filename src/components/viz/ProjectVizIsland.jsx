import { useState } from 'react';
import { ProjectViz } from './microviz.jsx';

// Island wrapper for a project's micro-visualization. Reads vizAnim from the
// saved tweaks (default on, matching TW_DEFAULTS) and applies the .mv-anim CSS
// gate + the animate prop, exactly as the old PortfolioSite did via
// useShellTweaks. Used with client:only, so the value is read synchronously on
// client mount (no SSR -> no hydration mismatch; the viz is decorative and the
// page text is static SSR). A production visitor (inert tweaks panel) always
// gets the default-on animation; the harness pins vizAnim:false to freeze it.
export default function ProjectVizIsland({ id }) {
  const [vizAnim] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rw_tweaks_v1') || '{}').vizAnim !== false;
    } catch {
      return true;
    }
  });
  return (
    <div className={vizAnim ? 'mv-anim' : ''}>
      <ProjectViz id={id} animate={vizAnim} />
    </div>
  );
}
