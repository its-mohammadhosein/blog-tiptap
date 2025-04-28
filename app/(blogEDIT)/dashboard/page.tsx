import { links } from "@/app/lib/links";
import { buttonVariants } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Post } from "@prisma/client";
import Link from "next/link";
import QuickEditBlogPost from "./quickEditDrawer";

type status = "SCHEDULED" | "PUBLISHED" | "DRAFT" | "REVIEW";

type PostsTableProps = {
  posts: Post[];
};
export type PostWithAuthor = Post & {
  author: { email: string };
};

type Props = {
  posts: PostWithAuthor[];
};

export default async function page() {
  const res = await fetch(`${links.baseUrl}/api/blog/post`,{next:{tags:['postlist']}}); // Adjust the base URL if needed
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = (await res.json()) as PostWithAuthor[];
  const getBackground = (status: status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500";
      case "SCHEDULED":
        return "bg-blue-500";
      case "DRAFT":
        return "bg-gray-400";
      case "REVIEW":
        return "bg-yellow-400";
      default:
        return "bg-white";
    }
  };
  return (
    <>
      <div className="max-w-6xl mx-auto py-8">
        <Table className="bg-card rounded-lg border">
          <TableCaption>A list of your blog posts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="w-[180px]">Created At</TableHead>
              <TableHead className="text-center w-[120px] ">Author</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cn(
                      getBackground(post.publishStatus)
                    )}`}
                  >
                    {post.publishStatus}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:underline hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{"Unknown"}</span>
                    <span className="text-xs text-muted-foreground">
                      {post.author.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{`${post.createdAt}`}</TableCell>
                <TableCell>{`${post.author.email}`}</TableCell>
                <TableCell className="text-right">
                  <Link
                    prefetch={false}
                    href={`/dashboard/${post.slug}/edit`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    Edit
                  </Link>
                </TableCell>
                <TableCell>
                  <QuickEditBlogPost postSlug={post.slug} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
