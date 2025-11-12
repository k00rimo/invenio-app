import { Link, useParams } from "react-router";
import elixirLogo from '@/assets/images/elixir-logo.png';
import { Button } from "@/components/ui/button";
import RecordCard from "@/components/layout/records-list-page/RecordCard";


const detail: {
  name: string
  description: string
} = {
  name: "Elixir",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
}

const CommunityDetailPage = () => {
  const { id } = useParams();

  console.log(id)
  
  return (
    <div className="self-center flex min-h-svh max-w-5xl flex-col gap-6 mt-16">
      <div className="flex items-center gap-6">
        <img
          src={elixirLogo}
          alt="Community profile picture"
          className="h-[100px] w-[100px]"
        />
        <h1 className="font-heading mb-6">{detail.name}</h1>
      </div>
      <div className="space-y-2">
        <h3 className="font-heading3">Description</h3>
        <p className="text-gray-dark">{detail.description}</p>
      </div>
      <div className="flex justify-between items-end">
        <h3 className="font-heading3">Recent records</h3>
        <Link to={`/records-list?community=${detail.name}`}>  {/* TODO: change to data from the API */}
          <Button size={"md"}>Search community records</Button>
        </Link>
      </div>
      <div className="space-y-5 mb-8">
        <RecordCard recordLink={"/records/MD-A00001/overview"} title={"Title of the record"} access={"open"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
        <RecordCard recordLink={"/records/MD-A00001/overview"} title={"Title of the record"} access={"restricted"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
        <RecordCard recordLink={"/records/MD-A00001/overview"} title={"Title of the record"} access={"closed"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
        </div>
    </div>
  );
}

export default CommunityDetailPage
