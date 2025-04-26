"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { Editor } from "@tiptap/core";
import Image from "next/image";
import { links } from "@/app/lib/links";
interface imageList {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: "image/png";
  createdAt: string;
  updatedAt: string;
}
export interface imageListRespons {
  page: number;
  page_size: number;
  total: number;
  result: imageList[];
}
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ImageChoosing({
  Value,
  setValue,
  editor,
}: {
  Value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  editor: Editor;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [Images, setImages] = useState<imageList[]>();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles, fileRejections) => {
      setUploadError(null);
      if (fileRejections.length > 0) {
        const { errors } = fileRejections[0];
        if (errors[0].code === "file-too-large") {
          form.setError("image", {
            type: "manual",
            message: "File is too large (max 5MB)",
          });
        } else if (errors[0].code === "file-invalid-type") {
          form.setError("image", {
            type: "manual",
            message: "Invalid file type",
          });
        }
        return;
      }
      form.setValue("image", acceptedFiles[0], { shouldValidate: true });
    },
  });

  const selectedFile = form.watch("image");
  useEffect(() => {
    if (!Value) {
      form.reset(); // clears all form fields, including "image"
      setUploadError(null);
      setUploadSuccess(false);
    }
  }, [Value]);
  const onSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/upload/image/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      setUploadSuccess(true);
      editor
        .chain()
        .focus()
        .setImage({ src: result.url, alt: "", title: "name" })
        .run();
      // Optional: pass the result to parent component
      // if you need to use the uploaded image elsewhere
      setValue(false); // Close drawer on success
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const images = await fetch(`${links.baseUrl}/api/upload/image`);
      if (images.ok) {
        const data = (await images.json()) as imageListRespons;
        console.log("images are herer", data);

        setImages(data.result);
      }
    };
    fetchImages();
  }, []);

  const removeFile = () => {
    form.resetField("image");
    setUploadError(null);
  };

  return (
    <Drawer open={Value} onOpenChange={setValue}>
      <DrawerContent>
        <DrawerHeader>
          <div className="w-full flex flex-col items-center gap-5">
            <DrawerTitle>بارگذاری تصویر</DrawerTitle>
            <DrawerDescription>
              تصویر مورد نظر خود را انتخاب کنید.
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="w-full min-h-[350px] p-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } ${form.formState.errors.image ? "border-red-500" : ""}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud className="h-10 w-10 text-gray-400" />
                {isDragActive ? (
                  <p className="text-blue-500">Drop the image here...</p>
                ) : (
                  <p className="text-gray-600">
                    Drag & drop an image here, or click to select
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Only JPEG, PNG, WebP (Max 5MB)
                </p>
              </div>
            </div>

            {form.formState.errors.image && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.image.message}
              </p>
            )}

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </form>
        </div>
        <DrawerFooter>
          <div className="w-full h-[50px] flex justify-evenly">
            {Images?.map((item) => {
              console.log(item);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setImage({ src: item.filePath, alt: item.fileName })
                      .run();
                  }}
                  className="flex items-center gap-3 p-3 bg border rounded-xl"
                >
                  <Image
                    src={item.filePath}
                    alt="Image"
                    width={300}
                    height={300}
                    className="w-[50px] h-auto"
                  />
                </div>
              );
            })}
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!selectedFile || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Uploading..." : "Upload"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
