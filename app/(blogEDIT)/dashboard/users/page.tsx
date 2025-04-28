import { links } from "@/app/lib/links";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface UserResponse {
  result: {
    id: number;
    email: string;
    role: string;
    createdAt: string;
    _count: {
      posts: number;
    };
  }[];
}

export default async function page() {
  const fetchusers = await fetch(`${links.baseUrl}/api/users`, {
    credentials: "include",
  });
  const users = (await fetchusers.json()) as UserResponse;
  console.log(users);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow >
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created date</TableHead>
            <TableHead>Pots</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.result.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
