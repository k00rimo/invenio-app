"use client";

import { useRef } from "react";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
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
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CommunityCreatePage = () => {
  const navigate = useNavigate();
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
    formState: { isSubmitting },
  } = methods;

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
    if (data.picture) {
      formData.append("picture", data.picture[0]);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    
    toast.success("Community created.", {
      position: "top-center"
    })
    navigate("/community");
  };

  return (
    <div className="self-center flex w-full max-w-3xl flex-col gap-2 py-16">
      <div>
        <h1 className="font-heading mb-6">New community</h1>
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
                  <FormDescription>{selectedFileName} (Max 5MB)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default CommunityCreatePage;
