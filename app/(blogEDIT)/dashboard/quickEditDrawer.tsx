"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { links } from "@/app/lib/links";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PostWithAuthor } from "./page";
import Link from "next/link";
import { CiLink } from "react-icons/ci";
import { generateSlug } from "@/app/lib/generateSlug";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { revalidating } from "@/app/lib/LoginAction";
type PublishStatus = "PUBLISHED" | "SCHEDULED" | "DRAFT" | "REVIEW";

interface QuickEditBlogPostProps {
  postSlug: string;
}

interface FormInterface {
  title: string;
  slug: string;
  indexed: boolean;
  publishStatus: PublishStatus;
}

const PUBLISH_STATUS_OPTIONS: PublishStatus[] = [
  "PUBLISHED",
  "SCHEDULED",
  "DRAFT",
  "REVIEW",
];

export default function QuickEditBlogPost({
  postSlug,
}: QuickEditBlogPostProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState<FormInterface | null>(
    null
  );
  const { toast } = useToast()
  const router = useRouter()
  const [summary, setsummary] = useState<PostWithAuthor>();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<FormInterface>({
    defaultValues: {
      title: "",
      slug: "",
      indexed: false,
      publishStatus: "DRAFT",
    },
    mode: "onChange", // Validate on change
  });
  const titleValue = watch("title");
  const slugValue = watch("slug");
  useEffect(() => {
    if (dirtyFields.title && !dirtyFields.slug) {
      const generatedSlug = generateSlug(titleValue);
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [titleValue, dirtyFields.title, dirtyFields.slug, setValue]);
  const validateSlug = (value: string) => {
    if (!value) return "Slug is required";
    const generatedSlug = generateSlug(value);
    if (value !== generatedSlug) {
      return `Slug should be in format like: ${generatedSlug}`;
    }
    return true;
  };
  const onSubmit = async (data: FormInterface) => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${links.baseUrl}/api/blog/${postSlug}/editing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          // newSlug: data.slug, // The API expects newSlug in the body
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update post");
      }

      const updatedPost = await response.json();
      
      // toast({title:"Post updated successfully"});
      setOpen(false);
      //router.refresh(); // Refresh the page to show updated data
      const rev = await revalidating('postlist')
      // Update local state if slug changed
      if (updatedPost.slug !== postSlug) {
        // Handle navigation or state update if needed
      }
    } catch (error: any) {
      console.error("Update error:", error);
      // toast(error.message || {title:"Failed to update post"});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${links.baseUrl}/api/blog/${postSlug}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const data = (await res.json()) as PostWithAuthor;
      reset({
        indexed: data.indexed,
        slug: data.slug,
        title: data.title,
        publishStatus: data.publishStatus,
      });
      const fetchedValues = {
        indexed: data.indexed,
        slug: data.slug,
        title: data.title,
        publishStatus: data.publishStatus,
      };

      setsummary(data);

      setDefaultValues(fetchedValues);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const isFormDirty = () => {
    if (!defaultValues) return false;
    const currentValues = watch();
    return Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof FormInterface] !==
        defaultValues[key as keyof FormInterface]
    );
  };
  useEffect(() => {
    if (open) {
      fetchPost();
    }
  }, [open]);

  const indexedValue = watch("indexed");
  const publishStatusValue = watch("publishStatus");

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Quick Edit</Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerHeader>
            <DrawerTitle>Edit Blog Post</DrawerTitle>
            <DrawerDescription>
              Make changes to your blog post here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex justify-center py-4">
            <div className="w-[70%] space-y-4">
              <div>
                {isLoading ? (
                  "loading"
                ) : (
                  <div className="flex  gap-1">
                    <span className="bg-red-50 rounded-md p-0.5">
                      {summary?.title}
                    </span>{" "}
                    is on
                    <span className="bg-red-50 rounded-md p-0.5">
                      {summary?.publishStatus}
                    </span>
                    mode, and it's available in
                    {summary && (
                      <Link
                        href={`preview/${summary.slug}`}
                        className="bg-red-50 hover:bg-red-100 rounded-md p-1 flex items-center gap-2"
                      >
                        {summary.slug}
                        <CiLink className="size-3" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    {...register("title", { required: "Title is required" })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    className={`${errors.slug && cn("border-orange-600 focus-visible:ring-orange-600")}`}
                    id="slug"
                    placeholder="Enter URL slug"
                    {...register("slug", {
                      required: "Slug is required",
                      validate: validateSlug,
                    })}
                  />
                  <p className="h-4 text-red-600">
                    {errors.slug && errors.slug.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="indexed"
                  checked={indexedValue}
                  onCheckedChange={(checked) => setValue("indexed", checked)}
                />
                <Label htmlFor="indexed">Indexed in search engines</Label>
              </div>

              <div className="space-y-2">
                <Label>Publish Status</Label>
                <Select
                  value={publishStatusValue}
                  onValueChange={(value: PublishStatus) =>
                    setValue("publishStatus", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLISH_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <Button
              type="submit"
              disabled={!isFormDirty() || isLoading || !isValid}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
