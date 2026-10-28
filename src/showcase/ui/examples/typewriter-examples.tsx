'use client';
import { useState } from 'react';
import { Button } from '../../../components/button/index.js';
import { TypewriterText } from '../../../components/typewriter-text/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function TypewriterExamples() {
  const { typewriter: copy } = useDesignSystemCopy();
  const [replay, setReplay] = useState(0);
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="vui-showcase-stack">
      <p className="vui-showcase-typewriter">
        <TypewriterText text={copy.text} replayKey={replay} enabled={enabled} />
      </p>
      <div className="vui-showcase-row">
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>
          {copy.replay}
        </Button>
        <Button
          variant="outline"
          aria-pressed={enabled}
          onClick={() => setEnabled((value) => !value)}
        >
          {copy.motion}
        </Button>
      </div>
    </div>
  );
}
