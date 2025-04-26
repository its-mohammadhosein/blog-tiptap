import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Post } from "@prisma/client";
import { links } from "@/app/lib/links";

// type Post = {
//   id: string;
//   title: string;
//   author: {
//     name: string | null;
//     email: string;
//   };
//   createdAt: Date;
//   published: boolean;
// };

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
  const res = await fetch(`${links.baseUrl}/api/blog/post`); // Adjust the base URL if needed
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = (await res.json()) as PostWithAuthor[];
  return (
    <div className="max-w-6xl mx-auto py-8">
      <Table className="bg-card rounded-lg border">
        <TableCaption>A list of your blog posts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="w-[180px]">Created At</TableHead>
            <TableHead className="text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    false
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {false ? "Published" : "Draft"}
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
              <TableCell className="text-right">
                <Link
                  prefetch={false}
                  href={`/dashboard/${post.slug}/edit`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
