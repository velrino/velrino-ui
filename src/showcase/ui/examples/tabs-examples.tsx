import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/tabs/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function TabsExamples() {
  const { tabs: copy } = useDesignSystemCopy();
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label={copy.description}>
        <TabsTrigger value="overview">{copy.first}</TabsTrigger>
        <TabsTrigger value="details">{copy.second}</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          {copy.disabled}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">{copy.firstBody}</TabsContent>
      <TabsContent value="details">{copy.secondBody}</TabsContent>
    </Tabs>
  );
}
