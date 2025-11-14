"use client";

import { useRef, useEffect, useState } from "react";
import {
  useForm,
  type SubmitHandler,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  communityFormSchema,
  type CommunityFormData,
} from "@/lib/validators/communitySchema";

import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloudIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const mockApiData = {
  name: "Elixir (Fetched Data)",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
}

const CommunityFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      picture: undefined,
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEditMode) {
      const fetchCommunityData = async () => {
        setIsLoadingData(true);
        try {
          // TODO: Replace with actual API call:
          await new Promise(resolve => setTimeout(resolve, 500));
          const fetchedData = mockApiData; 

          // Populate the form with fetched data
          reset({
            name: fetchedData.name,
            description: fetchedData.description,
            picture: undefined, // File inputs cannot be programmatically set
          });
        } catch (error) {
          console.error("Failed to fetch community data:", error);
          toast.error("Failed to load community data.");
          navigate("/community");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchCommunityData();
    }
  }, [id, isEditMode, reset, navigate]);

  const pictureFile = watch("picture");
  const selectedFileName =
    pictureFile && pictureFile.length > 0
      ? pictureFile[0].name
      : "No file selected.";

  const { ref: fileInputRegisterRef, ...fileInputProps } = register("picture");

  const processForm: SubmitHandler<CommunityFormData> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.picture && data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }
    
    try {
      if (isEditMode) {
        // TODO: Replace with actual API call
        console.log("UPDATING community:", id, data);
        await new Promise((resolve) => setTimeout(resolve, 500));

        toast.success("Community updated.");
        navigate(`/community/${id}`);
      } else {
        // TODO: Replace with actual API call
        console.log("CREATING community:", data);
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        toast.success("Community created.");
        // TODO: Navigate to new community's page if API returns ID
        navigate("/community"); // Or back to list
      }
    } catch (error) {
      console.error("Failed to save community:", error);
      toast.error("Failed to save community. Please try again.");
    }
  };

  if (isLoadingData) {
    return (
      <div className="self-center flex w-full max-w-3xl justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="self-center flex w-full max-w-3xl flex-col gap-2 py-16">
      <div>
        <h1 className="font-heading mb-6">
          {isEditMode ? "Edit community" : "New community"}
        </h1>
        <Separator />
      </div>

      <FormProvider {...methods}>
        <Form {...methods}>
          <form
            onSubmit={handleSubmit(processForm)}
            className="w-full space-y-8 mt-6"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Community Name</FormLabel>
                  <FormControl>
                    <Input variant={"deposition"} placeholder="e.g., Structural Biology Hub" {...field} />
                  </FormControl>
                  <FormDescription>
                    The public name of your community.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short description of your community's purpose..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="picture"
              render={() => (
                <FormItem>
                  <FormLabel>Community Picture</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      {...fileInputProps}
                      ref={(e) => {
                        fileInputRegisterRef(e);
                        fileInputRef.current = e;
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<UploadCloudIcon className="h-4 w-4" />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                  <FormDescription>
                    {selectedFileName} (Max 5MB)
                    {isEditMode && " Leave blank to keep existing picture."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Saving..."
                    : "Creating..."
                  : isEditMode
                    ? "Save Changes"
                    : "Create Community"}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default CommunityFormPage;
