import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../../components/accordion/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function AccordionExamples() {
  const { accordion: copy } = useDesignSystemCopy();
  return (
    <Accordion type="single" collapsible defaultValue="shared">
      <AccordionItem value="shared">
        <AccordionTrigger>{copy.question}</AccordionTrigger>
        <AccordionContent>{copy.answer}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="palette">
        <AccordionTrigger>{copy.secondQuestion}</AccordionTrigger>
        <AccordionContent>{copy.secondAnswer}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
