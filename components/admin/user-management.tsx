"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";

import { fetchData } from "@/lib/api";

import { getToken } from "@/utils/auth";

// const BASE_URL = "https://api.ayobilearning.com/api"
// const API_KEY = "j5przhP5sjTF7PyFXBAFiM685ajXJnwUmpxvQPsmVG4xXyiYH2NoIrQYTwynBsK3"

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
    roleId: "",
  });

  const fetchRoles = async () => {
    // try {const token = localStorage.getItem("access_token")
      // const token = localStorage.getItem("access_token")
      // const res = await fetch(`${BASE_URL}/roles?per_page=10&page=1`, {
      //   headers: {
      //     "x-api-key": API_KEY,
      //     "Authorization": `Bearer ${token}`,
      //     "Accept" : "application/json"
      //   }
      // })

      const resultJson = await fetchData("/roles", {
        // method: 'POST',
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });

      const data = resultJson.data;

      setRoles(data)

      // console.log(data)

      // if (res.ok) setRoles(data || []);
    //   else throw new Error("Failed to fetch roles");
    // } catch (error) {
    //   console.error("❌ Failed to fetch roles:", error);
    // }
  };

  const fetchUsers = async () => {
  try {
    const resultJson = await fetchData("/users", {
      headers: {
        "Authorization": `Bearer ${getToken()}`,
      },
    });

    const data = resultJson.data;
    setUsers(data);
  } catch (error) {
    console.error("❌ Failed to fetch users:", error);
  }
};


//   const createUser = async (userData: any) => {
//   try {
//     const response = await fetchData('/manage/users/store', {
//       method: 'POST',
//       body: userData,  // Form data
//     });
//     console.log('User created:', response);
//   } catch (error) {
//     console.error('Error creating user:', error);
//   }
// };


// const handleCreateUser = async () => {
//   try {
//     const payload = {
//       fullname: newUser.fullname,
//       email: newUser.email,
//       password: newUser.password,
//       roles: [newUser.roleId],
//     };

//     const resultJson = await fetchData("/users", {
//       method: "POST",
//       body: payload,
//       headers: {
//         "Authorization": `Bearer ${getToken()}`,
//       },
//     });

//     if (resultJson.success) {
//       fetchUsers();  // Refresh user list after successful creation
//       setIsCreateUserOpen(false);
//     } else {
//       throw new Error("Failed to create user");
//     }
//   } catch (error) {
//     alert(`❌ Error: ${error.message}`);
//   }
// };




  useEffect(() => {
    fetchRoles();
    // fetchUsers()
  }, []);
//   useEffect(() => {
//   fetchUsers();
// }, []);


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-midnight-blue-800">
          User Management
        </h1>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
              <UserPlus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill out the form to add a new user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Full Name</Label>
              <Input
                value={newUser.fullname}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullname: e.target.value })
                }
              />
              <Label>Email</Label>
              <Input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <Label>Password</Label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <Label>Role</Label>
              <Select
                value={newUser.roleId}
                onValueChange={(val) => setNewUser({ ...newUser, roleId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role: any) => (
                    <SelectItem
                      className="capitalize"
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateUserOpen(false)}
              >
                Cancel
              </Button>
              <Button
                // onClick={handleCreateUser}
                className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table filter & render */}
      <div className="flex gap-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {roles.map((r: any) => (
              <SelectItem key={r.id} value={r.name}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* User Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter(
                  (u) =>
                    selectedRole === "all" || u.roles.includes(selectedRole)
                )
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.roles?.[0]}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
