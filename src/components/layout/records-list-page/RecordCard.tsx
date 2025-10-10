import LabeledList from "@/components/shared/LabeledList"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router"

import euFlag from '@/assets/images/european-union.png';
import CollapsibleBlock from "@/components/shared/CollapsibleBlock";

type RecordCardProps = {
  recordLink: string
  title: string
  access: "open" | "restricted" | "closed"
  language: string
  dateOfAcquisition: Date
  authors: string[]
  tags: string[]
  affiliation: string
  imageUrl: string
}

const RecordCard = ({
  recordLink,
  title,
  access,
  language,
  dateOfAcquisition,
  authors,
  tags,
  affiliation,
  imageUrl,
}: RecordCardProps) => {

  const formattedDate = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateOfAcquisition));

  return (
    <div className="w-full max-w-4xl p-6 shadow-dropdown rounded-sm space-y-5">
      <div className="space-y-1">
        <Link to={recordLink} className="flex items-center justify-between">
          <h3 className="font-heading3">{title}</h3>
          <div className="flex items-center gap-2.5">
            <Badge variant={access}>{access}</Badge>
            <Badge>{language}</Badge>
          </div>
        </Link>
        <p className="font-subheadline text-gray-dark">{`Date of acquisition ${formattedDate}`}</p>
      </div>
      <div className="flex gap-4">
        <img
          src={euFlag}
          alt="Flag of the European Union"
          className="h-[130px] w-auto"
        />
        <div className="space-y-1">
          <LabeledList label="Authors" list={authors} orientation="horizontal" />
          <LabeledList label="Tags" list={tags} orientation="horizontal" />
          <CollapsibleBlock label="Affiliation" text={affiliation} className="max-w-2/3" />
        </div>
      </div>
    </div>
  )
}

export default RecordCard
