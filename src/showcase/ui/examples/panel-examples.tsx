import { Panel } from '../../../components/panel/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function PanelExamples() {
  const { panels: copy } = useDesignSystemCopy();
  return (
    <div className="vui-showcase-grid">
      <Panel appearance="default" className="vui-showcase-nested-panel">
        <h3>{copy.standard}</h3>
        <p>{copy.body}</p>
      </Panel>
      <Panel appearance="sci-fi" className="vui-showcase-nested-panel">
        <h3>{copy.scifi}</h3>
        <p>{copy.body}</p>
      </Panel>
    </div>
  );
}
