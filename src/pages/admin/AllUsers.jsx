import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getAllUsers } from '../../services/adminService';
import {
	AlertCircle,
	Loader2,
	RefreshCw,
	Search,
	Shield,
	Users,
} from 'lucide-react';

function formatDateTime(value) {
	if (!value) return 'N/A';
	return new Date(value).toLocaleString();
}

function getRoleVariant(role) {
	return role === 'admin' ? 'maroon' : 'default';
}

const AllUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState(null);
	const [searchText, setSearchText] = useState('');

	const fetchUsers = async ({ silent = false } = {}) => {
		try {
			setError(null);
			if (silent) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}

			const response = await getAllUsers();
			setUsers(response.users || []);
		} catch (err) {
			setError(err.message || 'Failed to load users');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const filteredUsers = useMemo(() => {
		const query = searchText.trim().toLowerCase();
		if (!query) return users;

		return users.filter((user) => {
			const searchable = [
				String(user.id || ''),
				String(user.name || ''),
				String(user.email || ''),
				String(user.role || ''),
				String(user.google_id || ''),
			].join(' ').toLowerCase();

			return searchable.includes(query);
		});
	}, [users, searchText]);

	const summary = useMemo(() => {
		const total = users.length;
		const admins = users.filter((user) => user.role === 'admin').length;
		const students = users.filter((user) => user.role === 'student').length;

		return {
			total,
			admins,
			students,
		};
	}, [users]);

	if (loading) {
		return (
			<div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-ceylon-maroon mx-auto mb-4" />
					<p className="text-gray-500">Loading users...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="page-container page-transition">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="section-title">All Users</h1>
					<p className="section-subtitle">View all registered users in the authentication system</p>
				</div>
				<Button onClick={() => fetchUsers({ silent: true })} variant="outline" className="gap-2" disabled={refreshing}>
					{refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
					Refresh
				</Button>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
					<AlertCircle className="h-5 w-5 text-red-500" />
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}

			<div className="bg-gradient-to-r from-ceylon-maroon-50 to-ceylon-gold-50 rounded-xl border border-ceylon-maroon-100/50 p-5 mb-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<div className="p-2.5 rounded-xl bg-ceylon-maroon/10">
						<Users className="h-5 w-5 text-ceylon-maroon" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-semibold text-ceylon-maroon">
							{summary.total} total user{summary.total !== 1 ? 's' : ''}
						</p>
						<p className="text-xs text-gray-600 mt-0.5">
							{summary.admins} admin{summary.admins !== 1 ? 's' : ''} • {summary.students} student{summary.students !== 1 ? 's' : ''}
						</p>
					</div>
					<Badge variant="maroon" className="gap-1">
						<Shield className="h-3.5 w-3.5" />
						Admin View
					</Badge>
				</div>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Search className="h-4 w-4 text-ceylon-maroon" />
						Search
					</CardTitle>
					<CardDescription>Search by ID, name, email, role, or Google ID.</CardDescription>
				</CardHeader>
				<CardContent className="pt-4">
					<Input
						placeholder="Type to search users"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</CardContent>
			</Card>

			<Card className="overflow-hidden">
				<CardHeader>
					<CardTitle>User Records</CardTitle>
					<CardDescription>
						Showing {filteredUsers.length} of {users.length} registered users.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					{filteredUsers.length === 0 ? (
						<div className="py-14 text-center">
							<Users className="h-8 w-8 text-gray-300 mx-auto mb-3" />
							<p className="text-gray-400">No users found for the current search.</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Google ID</TableHead>
									<TableHead className="text-center">Role</TableHead>
									<TableHead>Registered At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell className="font-mono text-sm">#{user.id}</TableCell>
										<TableCell className="font-medium text-gray-900">{user.name || 'N/A'}</TableCell>
										<TableCell className="text-sm text-gray-600">{user.email || 'N/A'}</TableCell>
										<TableCell className="font-mono text-xs text-gray-500">{user.google_id || 'N/A'}</TableCell>
										<TableCell className="text-center">
											<Badge variant={getRoleVariant(user.role)}>{user.role || 'unknown'}</Badge>
										</TableCell>
										<TableCell className="text-sm text-gray-500">{formatDateTime(user.created_at)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AllUsers;
