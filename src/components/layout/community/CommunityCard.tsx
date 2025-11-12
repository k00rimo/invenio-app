import elixirLogo from '@/assets/images/elixir-logo.png';
import { cn } from "@/lib/utils"
import { Link } from 'react-router';

type CommunityCardProps = {
  name: string
  description: string
  slug: string
  className?: string
}

const CommunityCard = ({
  name,
  description,
  slug,
  className
}: CommunityCardProps) => {

  return (
    <div className={cn("flex items-center gap-6 p-4 rounded-md", className)}>
      <img
        src={elixirLogo}
        alt="Community profile picture"
        className="h-[100px] w-[100px] self-center"
      />
      <div className="space-y-1">
        <Link to={slug}>
          <h4 className="font-heading4 truncate">{name}</h4>
        </Link>
        <p className="text-gray-dark line-clamp-3 overflow-hidden">
          {description}
        </p>
      </div>
    </div>
  )
}

export default CommunityCard
