import { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    InputAdornment,
    CircularProgress,
    Theme,
} from "@mui/material";
import { Search, LocationOn, Business, AttachMoney } from "@mui/icons-material";

// Mock job data
const mockJobs = [
    {
        id: 1,
        title: "Full Stack Developer",
        company: "TechCorp",
        location: "New York, NY",
        salary: "$80,000 - $120,000",
        description:
            "We are looking for a Full Stack Developer to build and maintain our web applications...",
        tags: ["React", "Node.js", "MongoDB", "TypeScript"],
        logo: "https://via.placeholder.com/50",
        posted: "2 days ago",
    },
    {
        id: 2,
        title: "UX/UI Designer",
        company: "DesignHub",
        location: "San Francisco, CA",
        salary: "$90,000 - $110,000",
        description:
            "Join our creative team to design beautiful and functional user interfaces...",
        tags: ["Figma", "Adobe XD", "User Research", "Wireframing"],
        logo: "https://via.placeholder.com/50",
        posted: "1 week ago",
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudSystems",
        location: "Remote",
        salary: "$100,000 - $140,000",
        description:
            "Help us build and maintain our cloud infrastructure and CI/CD pipelines...",
        tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        logo: "https://via.placeholder.com/50",
        posted: "3 days ago",
    },
    {
        id: 4,
        title: "Data Scientist",
        company: "DataInsights",
        location: "Boston, MA",
        salary: "$110,000 - $150,000",
        description:
            "Use machine learning and statistical analysis to unlock insights from our data...",
        tags: ["Python", "Machine Learning", "SQL", "Data Visualization"],
        logo: "https://via.placeholder.com/50",
        posted: "Just now",
    },
    {
        id: 5,
        title: "Mobile Developer",
        company: "AppWorks",
        location: "Austin, TX",
        salary: "$85,000 - $115,000",
        description:
            "Build native mobile applications for iOS and Android platforms...",
        tags: ["Swift", "Kotlin", "React Native", "Mobile Design"],
        logo: "https://via.placeholder.com/50",
        posted: "5 days ago",
    },
];

const JobsFeed = ({ theme }: { theme: Theme }) => {
    const [jobs, setJobs] = useState(mockJobs);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        company: "",
        salary: "",
    });

    // Simulate loading jobs from API
    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setJobs(mockJobs);
            setLoading(false);
        }, 800);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    // Apply filters and search
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = filters.location
            ? job.location
                  .toLowerCase()
                  .includes(filters.location.toLowerCase())
            : true;
        const matchesCompany = filters.company
            ? job.company.toLowerCase().includes(filters.company.toLowerCase())
            : true;
        const matchesSalary = filters.salary
            ? job.salary.toLowerCase().includes(filters.salary.toLowerCase())
            : true;

        return (
            matchesSearch && matchesLocation && matchesCompany && matchesSalary
        );
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Find Your Dream Job
            </Typography>

            {/* Search bar */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search for jobs, skills or companies"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        placeholder="Filter by location"
                        variant="outlined"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOn />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        placeholder="Filter by company"
                        variant="outlined"
                        name="company"
                        value={filters.company}
                        onChange={handleFilterChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Business />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        placeholder="Filter by salary"
                        variant="outlined"
                        name="salary"
                        value={filters.salary}
                        onChange={handleFilterChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoney />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>

            {/* Job listings */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <Grid item xs={12} key={job.id}>
                                <Card
                                    sx={{
                                        p: 1,
                                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                                        transition:
                                            "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={2} md={1}>
                                                <Avatar
                                                    src={job.logo}
                                                    alt={job.company}
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={10} md={11}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                            component="h2"
                                                            gutterBottom
                                                        >
                                                            {job.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="text.secondary"
                                                            gutterBottom
                                                        >
                                                            {job.company} •{" "}
                                                            {job.location} •{" "}
                                                            {job.salary}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            paragraph
                                                        >
                                                            {job.description}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                mt: 2,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            {job.tags.map(
                                                                (
                                                                    tag,
                                                                    index
                                                                ) => (
                                                                    <Chip
                                                                        key={
                                                                            index
                                                                        }
                                                                        label={
                                                                            tag
                                                                        }
                                                                        size="small"
                                                                        sx={{
                                                                            mr: 1,
                                                                            mb: 1,
                                                                        }}
                                                                    />
                                                                )
                                                            )}
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="caption"
                                                            display="block"
                                                            gutterBottom
                                                            sx={{ mb: 2 }}
                                                        >
                                                            Posted {job.posted}
                                                        </Typography>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                        >
                                                            Apply Now
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <Typography variant="h6">
                                    No jobs found matching your criteria
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Try adjusting your search filters
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default JobsFeed;
