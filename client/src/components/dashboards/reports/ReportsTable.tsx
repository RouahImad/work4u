import { useState, useEffect } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    Box,
    Typography,
    IconButton,
    Chip,
} from "@mui/material";
import { Search, Clear, Flag } from "@mui/icons-material";
import { format } from "date-fns";

interface ReportDetail {
    id: number;
    post_title: string;
    user_email: string;
    description: string;
    reported_at: string;
}

interface ReportsTableProps {
    reports: ReportDetail[];
    limit?: number;
    showSearch?: boolean;
    title?: string;
}

const ReportsTable = ({
    reports,
    limit,
    showSearch = false,
    title = "Reports",
}: ReportsTableProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredReports, setFilteredReports] = useState<ReportDetail[]>(
        reports || []
    );

    useEffect(() => {
        if (!reports) return;

        const filtered = reports.filter(
            (report) =>
                report.post_title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                report.user_email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                report.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );

        setFilteredReports(filtered);
        setPage(0); // Reset to first page when filtering
    }, [searchTerm, reports]);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (error) {
            return "Invalid date";
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    // Apply limit if specified, otherwise paginate
    const displayReports = limit
        ? filteredReports.slice(0, limit)
        : filteredReports.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
          );

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
            {title && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {!showSearch && <Flag color="error" sx={{ mr: 1 }} />}
                    <Typography variant="h6">{title}</Typography>
                </Box>
            )}

            {showSearch && (
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search reports by job, user or description..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear search"
                                        onClick={clearSearch}
                                        edge="end"
                                        size="small"
                                    >
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            )}

            <TableContainer sx={{ maxHeight: limit ? "auto" : 440 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Job Post</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayReports.length > 0 ? (
                            displayReports.map((report) => (
                                <TableRow key={report.id} hover>
                                    <TableCell>
                                        <Chip
                                            label={report.post_title}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            sx={{
                                                maxWidth: "100%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{report.user_email}</TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {report.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatDate(report.reported_at)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    {searchTerm
                                        ? "No reports match your search"
                                        : "No reports found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!limit && filteredReports.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredReports.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
};

export default ReportsTable;
