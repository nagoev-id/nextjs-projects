'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { factsData } from '@/app/projects/easy/the-facts/mock';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { HELPERS } from '@/shared';

export type FactItem = {
  fact: ReactNode;
  text: string;
  source: string;
  index: number;
}
const TheFactsPage = () => {
  const [fact, setFact] = useState<FactItem | null>(null);

  const getRandomFact = useCallback((): FactItem => {
    const index = Math.floor(Math.random() * factsData.length);
    return {
      index,
      fact: factsData[index].text, // Adding the missing fact property
      ...factsData[index],
    };
  }, []);

  useEffect(() => {
    setFact(getRandomFact());
  }, [getRandomFact]);

  return (
    <Card className="max-w-2xl grid gap-2 text-center w-full mx-auto p-4 rounded">
      {fact && (
        <>
          <p><span className="uppercase font-semibold">Fact</span> #{fact.index} from <Link href={fact.source}>
            <Button className="p-0 text-blue-500" variant="link">here</Button>
          </Link>.</p>
          <h2 className="text-lg lg:text-2xl font-semibold font-serif">{fact.text}</h2>
          <div className="flex justify-center gap-2">
            <Button onClick={() => setFact(getRandomFact())}>Next Fact</Button>
            <Button onClick={() => HELPERS.copyToClipboard(fact?.text)} variant="outline">
              <Copy className="mr-2 h-4 w-4" /> Copy Fact
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default TheFactsPage;