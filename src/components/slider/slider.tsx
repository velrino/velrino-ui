'use client';
import { Slider as Primitive } from '@base-ui/react/slider';
import { cx } from '../../lib/classes.js';

export type SliderProps = Omit<Primitive.Root.Props, 'className'> & {
  className?: string;
  getAriaLabel?: Primitive.Thumb.Props['getAriaLabel'];
  getAriaValueText?: Primitive.Thumb.Props['getAriaValueText'];
};

export function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  getAriaValueText,
  ...props
}: SliderProps) {
  const values = value ?? defaultValue ?? [min, max];
  const count = typeof values === 'number' ? 1 : values.length;
  return (
    <Primitive.Root
      data-slot="slider"
      className={cx('vui-slider', className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="center"
      {...props}
    >
      <Primitive.Control data-slot="slider-control" className="vui-slider-control">
        <Primitive.Track data-slot="slider-track" className="vui-slider-track">
          <Primitive.Indicator data-slot="slider-range" className="vui-slider-range" />
        </Primitive.Track>
        {Array.from({ length: count }, (_, index) => (
          <Primitive.Thumb
            key={index}
            index={index}
            data-slot="slider-thumb"
            className="vui-slider-thumb"
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
          />
        ))}
      </Primitive.Control>
    </Primitive.Root>
  );
}
