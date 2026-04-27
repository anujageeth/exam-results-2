import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getAllResults, getExams } from '../../services/adminService';
import { getExamResults } from '../../services/resultService';
import {
	AlertCircle,
	CheckCircle2,
	Eye,
	Filter,
	Loader2,
	RefreshCw,
	Search,
} from 'lucide-react';

const gradeWeight = {
	'A+': 0,
	A: 1,
	'A-': 2,
	'B+': 3,
	B: 4,
	'B-': 5,
	'C+': 6,
	C: 7,
	'C-': 8,
	D: 9,
	F: 10,
};

function formatDateTime(value) {
	if (!value) return 'N/A';
	return new Date(value).toLocaleString();
}

function gradeBadgeVariant(grade) {
	if (!grade) return 'default';
	if (grade === 'F' || grade === 'D') return 'fail';
	if (grade.startsWith('A') || grade.startsWith('B')) return 'pass';
	return 'pending';
}

const AllResults = () => {
	const [results, setResults] = useState([]);
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState(null);
	const [examFilter, setExamFilter] = useState('');
	const [gradeFilter, setGradeFilter] = useState('');
	const [searchText, setSearchText] = useState('');
	const [sourceLabel, setSourceLabel] = useState('admin-service');

	const loadInitialData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [resultsRes, examsRes] = await Promise.all([
				getAllResults(),
				getExams(),
			]);

			setResults(resultsRes.results || []);
			setExams(examsRes.exams || []);
			setSourceLabel('admin-service');
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const refreshResults = async () => {
		try {
			setRefreshing(true);
			setError(null);

			if (examFilter) {
				const examRes = await getExamResults(examFilter);
				setResults(examRes.results || []);
				setSourceLabel('result-service (exam scoped)');
			} else {
				const resultsRes = await getAllResults();
				setResults(resultsRes.results || []);
				setSourceLabel('admin-service');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		loadInitialData();
	}, []);

	useEffect(() => {
		if (!loading) {
			refreshResults();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [examFilter]);

	const examMap = useMemo(() => {
		const map = {};
		exams.forEach((exam) => {
			map[String(exam.id)] = exam;
		});
		return map;
	}, [exams]);

	const examOptions = useMemo(
		() => exams.map((exam) => ({ value: String(exam.id), label: `${exam.name} (ID: ${exam.id})` })),
		[exams]
	);

	const gradeOptions = useMemo(() => {
		const uniqueGrades = [...new Set(results.map((result) => result.grade).filter(Boolean))];
		uniqueGrades.sort((a, b) => {
			const aVal = gradeWeight[a] ?? 99;
			const bVal = gradeWeight[b] ?? 99;
			return aVal - bVal;
		});
		return uniqueGrades.map((grade) => ({ value: grade, label: grade }));
	}, [results]);

	const filteredResults = useMemo(() => {
		const query = searchText.trim().toLowerCase();

		return results.filter((result) => {
			const byExam = !examFilter || String(result.exam_id) === examFilter;
			const byGrade = !gradeFilter || result.grade === gradeFilter;

			const searchable = [
				String(result.id || ''),
				String(result.student_id || ''),
				String(result.exam_id || ''),
				String(result.exam_name || examMap[String(result.exam_id)]?.name || ''),
				String(result.grade || ''),
			].join(' ').toLowerCase();

			const bySearch = !query || searchable.includes(query);
			return byExam && byGrade && bySearch;
		});
	}, [results, examFilter, gradeFilter, searchText, examMap]);

	const summary = useMemo(() => {
		const total = filteredResults.length;
		const published = filteredResults.filter((result) => !!result.published_at).length;
		const passing = filteredResults.filter((result) => result.grade && result.grade !== 'F' && result.grade !== 'D').length;
		const failing = filteredResults.filter((result) => result.grade === 'F' || result.grade === 'D').length;

		return {
			total,
			published,
			passing,
			failing,
		};
	}, [filteredResults]);

	if (loading) {
		return (
			<div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-ceylon-maroon mx-auto mb-4" />
					<p className="text-gray-500">Loading all results...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="page-container page-transition">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="section-title">All Results</h1>
					<p className="section-subtitle">View, filter, and monitor all student examination results</p>
				</div>
				<Button onClick={refreshResults} variant="outline" className="gap-2" disabled={refreshing}>
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
						<Eye className="h-5 w-5 text-ceylon-maroon" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-semibold text-ceylon-maroon">
							Showing {summary.total} result{summary.total !== 1 ? 's' : ''}
						</p>
						<p className="text-xs text-gray-600 mt-0.5">
							{summary.published} published • {summary.passing} pass • {summary.failing} fail
						</p>
					</div>
					{/* <Badge variant="maroon">Data source: {sourceLabel}</Badge> */}
				</div>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-ceylon-maroon" />
						Filters
					</CardTitle>
					<CardDescription>Filter by exam, grade, or quick search terms.</CardDescription>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Select
							label="Exam"
							placeholder="All exams"
							options={examOptions}
							value={examFilter}
							onChange={(e) => setExamFilter(e.target.value)}
						/>
						<Select
							label="Grade"
							placeholder="All grades"
							options={gradeOptions}
							value={gradeFilter}
							onChange={(e) => setGradeFilter(e.target.value)}
						/>
						<div>
							<Input
								label="Search"
								placeholder="Result ID, student ID, exam, grade"
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<div className="mt-1 text-xs text-gray-400 flex items-center gap-1">
								<Search className="h-3.5 w-3.5" /> Fast text match across visible fields
							</div>
						</div>
					</div>

					{(examFilter || gradeFilter || searchText) && (
						<div className="mt-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setExamFilter('');
									setGradeFilter('');
									setSearchText('');
								}}
							>
								Clear filters
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="overflow-hidden">
				<CardHeader>
					<CardTitle>Result Records</CardTitle>
					<CardDescription>
						Detailed result rows from backend services.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					{filteredResults.length === 0 ? (
						<div className="py-14 text-center">
							<CheckCircle2 className="h-8 w-8 text-gray-300 mx-auto mb-3" />
							<p className="text-gray-400">No results match the current filters.</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Result ID</TableHead>
									<TableHead>Student</TableHead>
									<TableHead>Exam</TableHead>
									<TableHead className="text-center">Score</TableHead>
									<TableHead className="text-center">Grade</TableHead>
									<TableHead>Published At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredResults.map((result) => {
									const examName = result.exam_name || examMap[String(result.exam_id)]?.name || `Exam ${result.exam_id}`;
									return (
										<TableRow key={result.id}>
											<TableCell className="font-mono text-sm">#{result.id}</TableCell>
											<TableCell className="font-medium">{result.student_id}</TableCell>
											<TableCell>
												<div className="font-medium text-gray-900">{examName}</div>
												<div className="text-xs text-gray-500">ID: {result.exam_id}</div>
											</TableCell>
											<TableCell className="text-center font-semibold">{result.score}</TableCell>
											<TableCell className="text-center">
												<Badge variant={gradeBadgeVariant(result.grade)}>{result.grade || 'N/A'}</Badge>
											</TableCell>
											<TableCell className="text-sm text-gray-500">{formatDateTime(result.published_at)}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AllResults;
