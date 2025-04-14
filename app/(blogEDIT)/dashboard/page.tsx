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

type Post = {
  id: string;
  title: string;
  author: {
    name: string | null;
    email: string;
  };
  createdAt: Date;
  published: boolean;
};

type PostsTableProps = {
  posts: Post[];
};
const posts: Post[] = [
  {
    id: "1",
    title: "",
    author: {
      name: null,
      email: "",
    },
    createdAt: new Date("2020-01-01T00:00:00Z"),
    published: false,
  },
];
export default function page() {
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
                    post.published
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
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
                  <span>{post.author.name || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">
                    {post.author.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {post.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  prefetch={false}
                  href={`/dashboard/${post.id}/edit`}
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
