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
          "absolute -left-0 -top-0 z-0 text-primary-medium-hover",  // TODO: change the color to a variable
          "h-[400px] w-[400px]"
        )}
        aria-hidden="true"
      />
      <MoleculeIcon
        className={cn(
          "absolute -bottom-0 -right-0 z-0 rotate-180 text-primary-medium",
          "h-[400px] w-[400px]"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "flex w-full min-w-fit max-w-3xl flex-col gap-10"
        )}
      >
        
        <div className="z-50 flex flex-col gap-6 shadow-2xl p-8 rounded-lg bg-background">
          <div className="space-y-2">
            <h1 className="font-heading md:max-w-3/5">Repository of Computational Chemistry Experiments</h1>
            <p className="max-w-4xl text-gray-dark">This repository contains experiments from various organizations. You can run simulations on experiments, download metadata and explore what you need.</p>
          </div>
          <SearchInputDeposition className="w-full"/>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
