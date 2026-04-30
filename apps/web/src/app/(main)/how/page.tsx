import HowCarousel from '@/components/shared/how-carousel';
import { constructMetadata } from '@/lib/utils';

export const metadata = constructMetadata({
  title: 'U Muzika | How It Works',
  description: 'Learn how our platform works through simple, guided steps.',
});

export default function HowPage() {
  return (
    <div className="fixed inset-0 pt-16 z-[45] bg-background overflow-hidden flex flex-col">
      <HowCarousel />
    </div>
  );
}
