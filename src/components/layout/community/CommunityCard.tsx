import placeholderLogo from '@/assets/images/square-placeholder.png';
import { cn } from "@/lib/utils"
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

type CommunityCardProps = {
  name: string
  description?: string
  slug: string
  className?: string
}

const CommunityCard = ({
  name,
  description,
  slug,
  className
}: CommunityCardProps) => {

  const apiLogoUrl = `/api/communities/${slug}/logo`;
  const [imgSrc, setImgSrc] = useState(apiLogoUrl);

  useEffect(() => {
    setImgSrc(`/api/communities/${slug}/logo`);
  }, [slug]);

  const handleImageError = () => {
    setImgSrc(placeholderLogo);
  };

  return (
    <div className={cn("flex items-center gap-6 p-4 rounded-md", className)}>
      <img
        src={imgSrc}
        onError={handleImageError}
        alt="Community profile picture"
        className="h-[100px] w-[100px] self-center rounded-md object-cover"
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

export default CommunityCard;
