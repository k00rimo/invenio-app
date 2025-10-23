import MoleculeIcon from "@/components/icons/MoleculeIcon"
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
        "md:min-h-[680px] 2xl:min-h-[780px] w-full overflow-hidden",
        "bg-gradient-main bg-cover bg-center",
        className
      )}
    >
      <MoleculeIcon
        className={cn(
          "absolute -left-0 -top-0 z-0 text-secondary-medium",  // TODO: change the color to a variable
          "h-[400px] w-[400px]"
        )}
        aria-hidden="true"
      />
      <MoleculeIcon
        className={cn(
          "absolute -bottom-0 -right-0 z-0 rotate-180 text-secondary-light",
          "h-[400px] w-[400px]"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "flex w-full min-w-fit max-w-3xl flex-col gap-10"
        )}
      >
        <div className="space-y-2.5">
          <h1 className="font-heading text-background">Repository of Computational Chemistry Experiments</h1>
          <p className="max-w-4xl text-gray-light">This repository contains experiments from various organizations. You can run simulations on experiments, download metadata and explore what you need.</p>
        </div>
        <div className="flex gap-5 shadow-2xl">
          <SearchInputDeposition className="w-full p-5 rounded-xl bg-background"/>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
