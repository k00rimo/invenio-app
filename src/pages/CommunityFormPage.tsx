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
import { UploadCloudIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import type { CreateCommunityPayload } from "@/types/mdpositTypes";
import { createCommunity, getCommunity, renameCommunity, updateCommunity } from "@/api/community";
import { isAxiosError } from "axios";
import { useAuthGuard } from "@/hooks/useAuthorization";
import LoadingComponent from "@/components/shared/LoadingComponent";

const createSlug = (title: string): string => {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ''); // Remove all non-word characters
};

const CommunityFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [communitySlug, setCommunitySlug] = useState<string>("");
  const isLoggedIn = useAuthGuard();


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
          const fetchedData = await getCommunity(id ?? "error");

          setCommunitySlug(fetchedData.slug);

          // Populate the form with fetched data
          reset({
            name: fetchedData.metadata.title,
            description: fetchedData.metadata.description ?? "",
            picture: undefined, // File inputs cannot be programmatically set
          });
        } catch (error) {
          console.error("Failed to fetch community data:", error);
          toast.error("Failed to load community data.", {
            position: "top-center"
          });
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
    try {
      
      const payload: CreateCommunityPayload = {
        slug: communitySlug === "" ? createSlug(data.name) : communitySlug,
        metadata: {
          title: data.name,
          description: data.description
        },
        access: {
          visibility: "public",
        },
      }

      if (isEditMode) {
        console.log("UPDATING community:", id, data);


        const updatedCommunity = await updateCommunity(id ?? "error", payload);
        
        // // TODO: uncomment when the API works, getting error code 502 for now
        // if (data.picture && data.picture.length > 0) {
        //   console.log("updating community logo for id:", id)
        //   const fileUploaded = await uploadCommunityLogo(id ?? "error", data.picture[0])
        //   console.log("uploaded", fileUploaded)
        // }
        
        toast.success("Community updated.");
        
        const newSlug = createSlug(updatedCommunity.metadata.title);
        if (newSlug !== communitySlug) {
          console.log("hello", updatedCommunity.slug, communitySlug)

          try {
            await renameCommunity(id ?? "error", { slug: newSlug })
          } catch (error) {
            console.error("Failed to rename community:", error);
            toast.error("Failed to rename community.", {
              position: "top-center"
            });
          }
        }

        navigate(`/community/${newSlug}`);
      } else {
        console.log("CREATING community:", data);
        const newCommunity = await createCommunity(payload);
        
        toast.success("Community created.");
        navigate(`/community/${newCommunity.slug}`);
      }
    } catch (error) {
      if (!isAxiosError(error)) {
        return;
      }

      // edge case - session expired *during* form fill
      if (error.status === 403) {
        toast.error("Your session expired. Please log in again.", {
          position: "top-center"
        });
        const currentPath = window.location.pathname + window.location.search;
        navigate(`/login?next=${encodeURIComponent(currentPath)}`, { replace: true });
        return; // Stop processing
      }

      console.error("Failed to save community:", error);
      toast.error("Failed to save community. Please try again.", {
        position: "top-center"
      });
    }
  };


  if (isLoadingData || !isLoggedIn) {
    return <LoadingComponent />
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
