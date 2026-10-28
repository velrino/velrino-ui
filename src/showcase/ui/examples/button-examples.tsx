'use client';
import { Button } from '../../../components/button/index.js';
import { AnchorLink } from '../../../components/anchor-link/index.js';
import { buttonSizes, buttonVariants } from '../../configs/showcase.js';
import { useButtonExamples } from '../../hooks/useButtonExamples.js';

export function ButtonExamples() {
  const { copy, action, selected, onAction, onToggle } = useButtonExamples();
  return (
    <div className="vui-showcase-stack">
      <div>
        <h3>{copy.variantsLabel}</h3>
        <div className="vui-showcase-row">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant} onClick={() => onAction(variant)}>
              {variant}
            </Button>
          ))}
          <Button variant="link" asChild>
            <AnchorLink href="#typography">Link</AnchorLink>
          </Button>
        </div>
      </div>
      <div>
        <h3>{copy.sizesLabel}</h3>
        <div className="vui-showcase-row">
          {buttonSizes.map((size) => (
            <Button key={size} size={size} variant="outline" onClick={() => onAction(size)}>
              {size}
            </Button>
          ))}
          <Button size="icon" aria-label={copy.iconLabel} onClick={() => onAction('icon')}>
            ↗
          </Button>
        </div>
      </div>
      <div>
        <h3>{copy.statesLabel}</h3>
        <div className="vui-showcase-row">
          <Button variant="outline" onClick={() => onAction(copy.normal)}>
            {copy.normal}
          </Button>
          <Button variant="outline" aria-pressed={selected} onClick={onToggle}>
            {copy.selected}
          </Button>
          <Button disabled>{copy.disabled}</Button>
          <Button disabled aria-busy="true">
            <span className="vui-showcase-spinner" aria-hidden="true" />
            {copy.loading}
          </Button>
        </div>
      </div>
      <p role="status" className="vui-showcase-feedback">
        {action ? copy.feedback.replace('{variant}', action) : copy.interactionHint}
      </p>
    </div>
  );
}
