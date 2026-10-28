import { HudPanel } from '../../../components/hud-panel/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function PanelExamples() {
  const { panels: copy } = useDesignSystemCopy();
  return (
    <HudPanel className="vui-showcase-nested-panel">
      <h3>{copy.title}</h3>
      <p>{copy.body}</p>
    </HudPanel>
  );
}
