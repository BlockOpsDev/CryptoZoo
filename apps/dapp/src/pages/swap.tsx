import { Swap as SwapCard } from "@cryptozoo/ui";

export default function Swap() {
  return <>
    <div className="grid grid-cols-6">
      <div className="col-span-6 tablet:col-span-2 tablet:col-start-3">
        <SwapCard />
      </div>
    </div>
  </>
}
