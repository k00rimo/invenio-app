import { Link, useNavigate, useParams } from "react-router";
import placeholderLogo from '@/assets/images/square-placeholder.png';
import { Button } from "@/components/ui/button";
import RecordCard from "@/components/layout/recordsListPage/RecordCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { DeleteCommunityDialog } from "@/components/dialogs/DeleteCommunityDialog";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useCommunity } from "@/hooks";
import { deleteCommunity } from "@/api/community";
import { useAuthAction } from "@/hooks/useAuthorization";
import { useQueryClient } from "@tanstack/react-query";
import LoadingComponent from "@/components/shared/LoadingComponent";
import QueryErrorComponent from "@/components/shared/QueryErrorComponent";

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { withAuthCheck } = useAuthAction();

  const apiLogoUrl = `/api/communities/${id}/logo`;
  const [imgSrc, setImgSrc] = useState(apiLogoUrl)

  useEffect(() => {
    if (id) {
      setImgSrc(`/api/communities/${id}/logo`);
    } else {
      setImgSrc(placeholderLogo);
    }
  }, [id]);

  const handleImageError = () => {
    setImgSrc(placeholderLogo);
  };

  const { data, isLoading, isError, error } = useCommunity(id ?? "error");
  
  if (isLoading) {
    return <LoadingComponent />
  }

  if (isError) {
    return <QueryErrorComponent error={error} />;
  }

  console.log(id);

  const handleDeleteCommunity = async () => {
    try {
      console.log("Deleting community:", id);
      await deleteCommunity(id ?? "error");

      toast.success("Community deleted successfully.");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["communities"] });
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
            src={imgSrc}
            onError={handleImageError}
            alt="Community profile picture"
            className="h-[100px] w-[100px] rounded-md object-cover"
          />
          <h1 className="font-heading mb-6">{data?.metadata.title}</h1>
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
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  const openDeleteDialog = () => {
                    setIsDeleteDialogOpen(true);
                  };
                  withAuthCheck(openDeleteDialog);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteCommunityDialog onConfirm={handleDeleteCommunity} />
        </AlertDialog>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading3">Description</h3>
        <p className="text-gray-dark">{data?.metadata.description ?? "Empty"}</p>
      </div>
      <div className="flex justify-between items-end">
        <h3 className="font-heading3">Recent records</h3>
        <Link to={`/records-list?community=${data?.slug}`}>
          <Button size={"md"}>Search community records</Button>
        </Link>
      </div>
      <div className="space-y-5 mb-8">
        <RecordCard recordLink={"/records/MD-A00001/overview"} title={"Title of the record"} access={"open"} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
        <RecordCard recordLink={"/records/MD-A00001/overview"} title={"Title of the record"} access={"restricted"} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
        <RecordCard recordLink={"/records/MD-A00001/overview"} title={"Title of the record"} access={"closed"} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
      </div>
    </div>
  );
}

export default CommunityDetailPage
