import ExploreIcon from "@/components/icons/ExploreIcon"
import { cn } from "@/lib/utils"

type ExploreSectionProps = {
  className?: string
}

const ExploreSection = ({className}: ExploreSectionProps) => {

  return (
    <section className={cn("w-full bg-primary-light flex items-center justify-center gap-24 py-24 px-2.5", className)}>
      <ExploreIcon />
      <div className="w-fit p-2.5 space-y-4">
        <h2 className="font-heading2">Explore data through interactive simulations</h2>
        <p className="max-w-2xl text-gray-dark">
          Dive into a rich library of chemistry experiments presented as dynamic, easy-to-read graphs. 
          Analyze trends and gain real insights. Our tools help researchers, students, and educators make sense of complex data through clear visualizations — all accessible from your browser
        </p>
      </div>
    </section>
  )
}

export default ExploreSection
