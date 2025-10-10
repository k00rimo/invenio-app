import SearchInputDeposition from "@/components/shared/SearchInputDeposition"
import { cn } from "@/lib/utils"

type HeroSectionProps = {
  className?: string
}

const HeroSection = ({className}: HeroSectionProps) => {

  return (
    <section
      className={cn(
        "relative flex items-center justify-center p-4 sm:p-6 md:p-8",
        "min-h-[600px] w-full overflow-hidden",
        "bg-homepage-landing bg-cover bg-center",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full min-w-fit max-w-3xl flex-col gap-10 rounded-xl bg-background p-10 shadow-2xl"
        )}
      >
        <div className="space-y-2.5">
          <h1 className="font-heading">Repository of Computational Chemistry Experiments</h1>
          <p className="text-gray-dark max-w-4xl">This repository contains experiments from various organizations. You can run simulations on experiments, download metadata and explore what you need.</p>
        </div>
        <div className="flex gap-5">
          <SearchInputDeposition className="w-full"/>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
