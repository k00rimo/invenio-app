import CommunityIcon from "@/components/icons/CommunityIcon"
import DocumentIcon from "@/components/icons/DocumentIcon"
import MagnifierIcon from "@/components/icons/MagnifierIcon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AboutSectionProps = {
  className?: string
}

const AboutSection = ({className}: AboutSectionProps) => {

  return (
    <section className={cn("w-full bg-background flex flex-col items-center justify-center gap-8 py-8 px-2 md:gap-16 md:py-24 md:px-8", className)}>
      <div className="max-w-6xl p-2.5 space-y-4">
        <h2 className="font-heading2">About MDRepo</h2>
        <p className="text-gray-dark">
          Our mission is to make computational chemistry data accessible and easy to explore. This platform brings together a wide range of experiments from trusted institutions, offering detailed metadata, simulation tools, and interactive visualizations. The repository helps you analyze and build upon existing chemical data — all in one place.
        </p>
      </div>
      
      {/* cards */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 items-center flex-1 justify-between md:flex-row">
        <Card className="w-fit md:w-auto">
          <CardContent>
            <MagnifierIcon />
          </CardContent>
          <CardHeader>
            <CardTitle className="font-heading3">Explore</CardTitle>
            <CardDescription className="text-gray-dark font-subheadline">Browse and explore our data</CardDescription>
          </CardHeader>
        </Card>

        <Card className="w-fit md:w-auto">
          <CardContent>
            <CommunityIcon />
          </CardContent>
          <CardHeader>
            <CardTitle className="font-heading3">Share</CardTitle>
            <CardDescription className="text-gray-dark font-subheadline">Share your data with others</CardDescription>
          </CardHeader>
        </Card>

        <Card className="w-fit md:w-auto">
          <CardContent>
            <DocumentIcon />
          </CardContent>
          <CardHeader>
            <CardTitle className="font-heading3">Use</CardTitle>
            <CardDescription className="text-gray-dark font-subheadline">Use data for your purpose</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  )
}

export default AboutSection
