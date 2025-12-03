import LabeledList from "@/components/shared/LabeledList"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router"

import CollapsibleBlock from "@/components/shared/CollapsibleBlock";
import { accessOptions } from "@/lib/deposition/formOptions";
import { formatDate } from "@/lib/utils";

type RecordCardProps = {
  recordLink: string
  title: string
  access: "open" | "restricted" | "closed"
  creationDate?: string
  authors?: string[]
  tags: string[]
  description?: string
  imageUrl: string
}

const RecordCard = ({
  recordLink,
  title,
  access,
  creationDate,
  authors,
  // tags,
  description,
  imageUrl,
}: RecordCardProps) => {
  const accessItem = accessOptions.filter((item) => item.value == access)[0]
  const formattedDate = formatDate(creationDate)

  return (
    <div className="w-full max-w-5xl p-6 shadow-dropdown rounded-sm space-y-4">
      <div className="space-y-0.5">
        <Link to={recordLink} className="flex items-center justify-between">
          <h4 className="font-heading4">{title}</h4>
          <div className="flex items-center justify-center gap-2.5">
            {<accessItem.icon />}
            <Badge variant={access}>{accessItem.label}</Badge>
          </div>
        </Link>
        <p className="font-subheadline text-gray-dark">{`Creation date ${formattedDate}`}</p>
      </div>
      <div className="w-full flex justify-between gap-4">
        <div className="space-y-1">
          {authors && (
            <LabeledList label="Authors" list={authors} orientation="horizontal" />
          )}
          {/* <LabeledList label="Tags" list={tags} orientation="horizontal" /> */}
          <CollapsibleBlock label="Description" text={description} className="" />
        </div>
        <img
          src={imageUrl}
          alt="Flag of the European Union"
          className="h-[130px] w-auto"
        />
      </div>
    </div>
  )
}

export default RecordCard
