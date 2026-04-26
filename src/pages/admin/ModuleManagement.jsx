import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from '../../components/ui/dialog';
import { modules, faculties } from '../../data/mockData';
import { Plus, Search, Pencil, Trash2, Filter } from 'lucide-react';

const facultyOptions = faculties.map(f => ({ value: f.name, label: f.name }));
const allDeptOptions = faculties.flatMap(f => f.departments).map(d => ({ value: d.name, label: d.name }));
const semOptions = [...new Set(modules.map(m => m.semester))].sort().map(s => ({ value: String(s), label: `Semester ${s}` }));
const typeOptions = [{ value: 'Core', label: 'Core' }, { value: 'Elective', label: 'Elective' }];

const getDeptOptionsForFaculty = (facultyName) => {
  if (!facultyName) return allDeptOptions;
  const faculty = faculties.find(f => f.name === facultyName);
  return faculty ? faculty.departments.map(d => ({ value: d.name, label: d.name })) : allDeptOptions;
};

const ModuleManagement = () => {
  const [search, setSearch] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editModule, setEditModule] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = modules.filter(m => {
    const matchSearch = !search ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase());
    const matchFaculty = !facultyFilter || m.faculty === facultyFilter;
    const matchDept = !deptFilter || m.department === deptFilter;
    const matchSem = !semFilter || m.semester === Number(semFilter);
    return matchSearch && matchFaculty && matchDept && matchSem;
  });

  return (
    <div className="page-container page-transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Module Management</h1>
          <p className="section-subtitle">Create and manage academic modules, credits, and codes</p>
        </div>
        <Button onClick={() => { setEditModule(null); setDialogOpen(true); }} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Module
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Filter className="h-4 w-4" /> Filters
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by code or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                placeholder="All Faculties"
                options={facultyOptions}
                value={facultyFilter}
                onChange={(e) => { setFacultyFilter(e.target.value); setDeptFilter(''); }}
              />
              <Select
                placeholder="All Departments"
                options={getDeptOptionsForFaculty(facultyFilter)}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              />
              <Select
                placeholder="All Semesters"
                options={semOptions}
                value={semFilter}
                onChange={(e) => setSemFilter(e.target.value)}
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
                <TableHead>Module Code</TableHead>
                <TableHead>Module Name</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-center">Semester</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium text-gray-900 font-mono">{m.code}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ceylon-maroon-50 text-ceylon-maroon font-semibold text-sm">
                      {m.credits}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{m.semester}</TableCell>
                  <TableCell>
                    <Badge variant="maroon" className="text-[11px]">{m.faculty}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">{m.department}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={m.type === 'Core' ? 'maroon' : 'gold'}>
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => { setEditModule(m); setDialogOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => { setDeleteTarget(m); setDeleteDialog(true); }}
                      >
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
        <span>Showing {filtered.length} of {modules.length} modules</span>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader onClose={() => setDialogOpen(false)}>
          <DialogTitle>{editModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
          <DialogDescription>
            {editModule ? 'Update module details below.' : 'Enter module details to create a new module.'}
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Module Code" placeholder="ICT5217" defaultValue={editModule?.code} />
              <Input label="Credits" type="number" placeholder="3" defaultValue={editModule?.credits} />
            </div>
            <Input label="Module Name" placeholder="Module Name" defaultValue={editModule?.name} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Faculty" options={facultyOptions} defaultValue={editModule?.faculty} />
              <Select label="Department" options={allDeptOptions} defaultValue={editModule?.department} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Semester" options={semOptions} defaultValue={editModule ? String(editModule.semester) : ''} />
              <Select label="Type" options={typeOptions} defaultValue={editModule?.type} />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setDialogOpen(false)}>
            {editModule ? 'Save Changes' : 'Add Module'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogHeader onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Module</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{deleteTarget?.code} - {deleteTarget?.name}</strong>? This action cannot be undone.
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

export default ModuleManagement;
