import type { Switch as Primitive } from '@base-ui/react/switch';
import type { SurfaceAppearance } from '../../provider/ui-provider.js';

export type SwitchProps = Omit<
  Primitive.Root.Props,
  'className' | 'children' | 'render' | 'nativeButton'
> & {
  className?: string;
  appearance?: SurfaceAppearance;
};
