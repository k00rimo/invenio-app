import CommunitySectionIcon from "@/components/icons/CommunitySectionIcon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router"

type CommunityProps = {
  className?: string
}

const CommunitySection = ({className}: CommunityProps) => {

  return (
    <section className={cn("w-full bg-primary-light flex items-center justify-center gap-24 py-24 px-2.5", className)}>
      
      <div className="w-fit p-2.5 space-y-4">
        <h2 className="font-heading2">Community</h2>
        <p className="max-w-2xl text-gray-dark">
          Join our growing network that is working with computational chemistry data. Share insights, discuss experiments, and collaborate on new ideas. Whether you're contributing datasets, helping improve simulations, or just exploring, your voice adds value to the community.
        </p>
        <Link to={"/community"}>
          <Button size={"md"}>Join community</Button>
        </Link>
      </div>
      <CommunitySectionIcon />
    </section>
  )
}

export default CommunitySection
