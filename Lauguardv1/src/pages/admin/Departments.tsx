
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Sample departments data
const initialDepartments = [
  { id: 1, name: 'Marketing', membersCount: 12, rulesCount: 3, status: 'active' },
  { id: 2, name: 'Engineering', membersCount: 24, rulesCount: 5, status: 'active' },
  { id: 3, name: 'Support', membersCount: 8, rulesCount: 2, status: 'active' },
  { id: 4, name: 'Sales', membersCount: 15, rulesCount: 3, status: 'active' },
  { id: 5, name: 'Human Resources', membersCount: 5, rulesCount: 4, status: 'inactive' },
];

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddDepartment = () => {
    if (!newDepartmentName.trim()) {
      toast({
        title: "Error",
        description: "Department name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newDepartment = {
      id: departments.length + 1,
      name: newDepartmentName,
      membersCount: 0,
      rulesCount: 0,
      status: 'active'
    };

    setDepartments([...departments, newDepartment]);
    setNewDepartmentName('');
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Department "${newDepartmentName}" has been created`,
    });
  };

  const toggleStatus = (id: number) => {
    setDepartments(departments.map(dept => 
      dept.id === id 
        ? { ...dept, status: dept.status === 'active' ? 'inactive' : 'active' } 
        : dept
    ));

    const department = departments.find(d => d.id === id);
    if (department) {
      const newStatus = department.status === 'active' ? 'inactive' : 'active';
      toast({
        title: "Status Updated",
        description: `Department "${department.name}" is now ${newStatus}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter department name" 
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                />
              </div>
              <Button onClick={handleAddDepartment} className="w-full">Create Department</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Security Rules</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.membersCount}</TableCell>
                  <TableCell>{department.rulesCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        department.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {department.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleStatus(department.id)}
                    >
                      {department.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Departments;
