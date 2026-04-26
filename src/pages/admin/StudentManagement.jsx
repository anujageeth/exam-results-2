import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from '../../components/ui/dialog';
import { students } from '../../data/mockData';
import { Plus, Search, Pencil, Trash2, Filter } from 'lucide-react';

const batchOptions = [...new Set(students.map(s => s.batch))].sort().map(b => ({ value: b, label: `Batch ${b}` }));
const courseOptions = [...new Set(students.map(s => s.course))].map(c => ({ value: c, label: c }));

const StudentManagement = () => {
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = students.filter(s => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.indexNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchBatch = !batchFilter || s.batch === batchFilter;
    const matchCourse = !courseFilter || s.course === courseFilter;
    return matchSearch && matchBatch && matchCourse;
  });

  const openAdd = () => { setEditStudent(null); setDialogOpen(true); };
  const openEdit = (student) => { setEditStudent(student); setDialogOpen(true); };
  const openDelete = (student) => { setDeleteTarget(student); setDeleteDialog(true); };

  return (
    <div className="page-container page-transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Student Management</h1>
          <p className="section-subtitle">Manage student profiles, batches, and courses</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Filter className="h-4 w-4" /> Filters
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, index, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                placeholder="All Batches"
                options={batchOptions}
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              />
              <Select
                placeholder="All Courses"
                options={courseOptions}
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Index No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead className="text-center">Semester</TableHead>
                <TableHead className="text-center">GPA</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-gray-900 font-mono text-xs">{s.indexNo}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{s.course}</TableCell>
                  <TableCell>{s.batch}</TableCell>
                  <TableCell className="text-center">{s.semester}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${s.gpa >= 3.5 ? 'text-emerald-600' : s.gpa >= 3.0 ? 'text-ceylon-gold-600' : 'text-orange-500'}`}>
                      {s.gpa.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={s.status === 'active' ? 'pass' : 'default'}>
                      {s.status === 'active' ? 'Active' : 'Graduated'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                        <Pencil className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDelete(s)}>
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>Showing {filtered.length} of {students.length} students</span>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader onClose={() => setDialogOpen(false)}>
          <DialogTitle>{editStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            {editStudent ? 'Update student information below.' : 'Enter student details to create a new profile.'}
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <Input label="Index Number" placeholder="CU/ICT/2024/001" defaultValue={editStudent?.indexNo} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full Name" placeholder="Student Name" defaultValue={editStudent?.name} />
              <Input label="Email" type="email" placeholder="student@ceylon.ac.lk" defaultValue={editStudent?.email} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Course"
                options={courseOptions}
                defaultValue={editStudent?.course}
              />
              <Select
                label="Batch"
                options={batchOptions}
                defaultValue={editStudent?.batch}
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setDialogOpen(false)}>
            {editStudent ? 'Save Changes' : 'Add Student'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogHeader onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.indexNo})? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => setDeleteDialog(false)}>Delete</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default StudentManagement;
