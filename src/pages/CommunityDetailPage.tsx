import { Link, useNavigate, useParams } from "react-router";
import elixirLogo from '@/assets/images/elixir-logo.png';
import { Button } from "@/components/ui/button";
import RecordCard from "@/components/layout/records-list-page/RecordCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { DeleteCommunityDialog } from "@/components/dialogs/DeleteCommunityDialog";
import { toast } from "sonner";
import { useState } from "react";

const detail: {
  name: string
  description: string
} = {
  name: "Elixir",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
}

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  console.log(id);

  const handleDeleteCommunity = async () => {
    try {
      // TODO: Replace with actual API call
      console.log("Deleting community:", id);
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Community deleted successfully.");
      setIsDeleteDialogOpen(false);
      navigate("/community");
    } catch (error) {
      console.error("Failed to delete community:", error);
      toast.error("Failed to delete community. Please try again.");
    }
  };

  return (
    <div className="self-center flex min-h-svh max-w-5xl flex-col gap-6 mt-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <img
            src={elixirLogo}
            alt="Community profile picture"
            className="h-[100px] w-[100px]"
          />
          <h1 className="font-heading mb-6">{detail.name}</h1>
        </div>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                size={"md"}
                rightIcon={
                  <ChevronDown className="w-5 h-5" />
                }
              >
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/community/${id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteCommunityDialog onConfirm={handleDeleteCommunity} />
        </AlertDialog>
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
