'use client';
import { Button } from '../../../components/button/index.js';
import { FullScreenLoader } from '../../../components/full-screen-loader/index.js';
import { useLoadingPreview } from '../../hooks/useLoadingPreview.js';

export function LoadingExample() {
  const { copy, open, progress, complete, onStart, onCancel } = useLoadingPreview();
  return (
    <div className="vui-showcase-stack">
      <Button variant="outline" onClick={onStart}>
        {copy.open}
      </Button>
      {open && (
        <FullScreenLoader
          label={copy.label}
          detail={copy.detail}
          cancelLabel={copy.cancel}
          progress={progress}
          onCancel={onCancel}
        />
      )}
      {complete && (
        <p role="status" className="vui-showcase-feedback">
          {copy.complete}
        </p>
      )}
    </div>
  );
}
