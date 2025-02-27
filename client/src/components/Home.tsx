import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Typography,
    Paper,
    Stack,
    Card,
    CardContent,
} from "@mui/material";
import {
    NightsStayRounded as DarkIcon,
    LightMode as LightIcon,
    Login as LoginIcon,
    Search,
    Work as Briefcase,
    People as Users,
    Description as FileText,
    Security as ShieldCheck,
    Public as Globe,
    BarChart,
    Assignment as ClipboardCheck,
    Favorite as HeartHandshake,
    EmojiEvents as Award,
    LinkedIn,
    Email,
    Phone,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import React from "react";

const services = [
    {
        icon: <Search />,
        text: "Advanced Job Search",
        description:
            "Find your ideal job effortlessly with our powerful search filters, allowing you to refine results by location, industry, salary, and more.",
    },
    {
        icon: <Briefcase />,
        text: "Easy Job Posting",
        description:
            "Employers can quickly create and manage job listings with an intuitive interface, ensuring a seamless hiring process.",
    },
    {
        icon: <FileText />,
        text: "AI Resume Screening",
        description:
            "Our AI-powered system analyzes resumes to match candidates with the most suitable job, saving time for recruiters and job seekers.",
    },
    {
        icon: <Users />,
        text: "Track Applications",
        description:
            "Stay updated on your job applications with real-time status tracking and notifications from recruiters.",
    },
    {
        icon: <ShieldCheck />,
        text: "Secure Data Protection",
        description:
            "We prioritize your privacy with security measures, ensuring your personal and professional data remains protected.",
    },
    {
        icon: <Globe />,
        text: "Global Job Opportunities",
        description:
            "Expand your job search beyond borders with international listings from top companies worldwide.",
    },
    {
        icon: <BarChart />,
        text: "Market Insights & Trends",
        description:
            "Stay ahead of the competition with up-to-date employment trends, salary insights, and industry demands.",
    },
    {
        icon: <ClipboardCheck />,
        text: "Verified Employers",
        description:
            "All companies on our platform go through a verification process, ensuring trust and reliability in every job listing.",
    },
    {
        icon: <HeartHandshake />,
        text: "Career Guidance",
        description:
            "Get expert advice on resume building, interview preparation, and career growth to land your dream job.",
    },
    {
        icon: <Award />,
        text: "Top Recruiters",
        description:
            "Connect with leading recruiters and hiring managers actively looking for talent like you.",
    },
];

export default function HomePage({
    theme,
    darkMode,
    setDarkMode,
}: {
    theme: { palette: { primary: { main: string } } };
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}) {
    return (
        <>
            <Box>
                {/* Modern Navbar */}
                <AppBar
                    position="static"
                    sx={{
                        background: darkMode ? "#121212" : "#ffffff",
                        boxShadow: "none",
                        borderBottom: "2px solid",
                        borderColor: darkMode ? "#333" : "#ddd",
                    }}
                >
                    <Container>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            py={2}
                        >
                            <Typography
                                variant="h4"
                                component="div"
                                fontWeight="bold"
                                sx={{
                                    color: darkMode ? "#fff" : "#000",
                                    userSelect: "none",
                                }}
                            >
                                <span
                                    style={{
                                        // fontFamily: "Pacifico, cursive",
                                        fontFamily: "Montserrat, sans-serif",
                                    }}
                                >
                                    Work
                                </span>
                                <span
                                    style={{
                                        fontFamily: "Pacifico, cursive",
                                        color: "#FF5050",
                                    }}
                                >
                                    4U
                                </span>{" "}
                                {/* #FF3D3D*/}
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <IconButton
                                    onClick={() => setDarkMode(!darkMode)}
                                >
                                    {darkMode ? (
                                        <LightIcon sx={{ color: "#ffcc00" }} />
                                    ) : (
                                        <DarkIcon sx={{ color: "#333" }} />
                                    )}
                                </IconButton>
                                <IconButton>
                                    <LoginIcon
                                        sx={{
                                            color: darkMode ? "#fff" : "#000",
                                        }}
                                    />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Container>
                </AppBar>

                <Container>
                    {/* Hero Section */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                            textAlign: "center",
                            minHeight: "80vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h2"
                            component="h1"
                            fontWeight="bold"
                            color="primary"
                            mb={2}
                        >
                            Connecting Talent with Opportunity
                        </Typography>
                        <Typography
                            variant="h6"
                            mb={4}
                            color="text.secondary"
                            maxWidth="lg"
                        >
                            Find the perfect job or the right candidate with our
                            AI-driven job application platform.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    color="primary"
                                    sx={{
                                        color: "#fff",
                                    }}
                                >
                                    Sign Up as Employee
                                </Button>
                            </motion.div>
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    sx={{
                                        color: "#fff",
                                    }}
                                >
                                    Sign Up as Employer
                                </Button>
                            </motion.div>
                        </Stack>
                    </Box>
                    {/* Services Section */}
                    <Paper
                        sx={{
                            my: 6,
                            py: 6,
                            px: 4,
                            borderRadius: 4,
                            textAlign: "center",
                            background: darkMode ? "#1e1e1e" : "#f8f9fa",
                        }}
                        component={motion.div}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            mb={4}
                            sx={{ color: darkMode ? "#ffffff" : "#333" }}
                        >
                            Our Premium Services
                        </Typography>
                        <Marquee
                            style={{ padding: "5px" }}
                            gradient={false}
                            speed={50}
                            pauseOnHover
                        >
                            {services.map((service, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                        p: 3,
                                        m: 2,
                                        width: 280,
                                        height: 280,
                                        borderRadius: "16px",
                                        background: darkMode ? "#222" : "#fff",
                                        boxShadow: darkMode
                                            ? "0px 4px 12px rgba(0, 0, 0, 0.4)"
                                            : "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: darkMode
                                                ? "0px 6px 15px rgba(0, 0, 0, 0.6)"
                                                : "0px 6px 15px rgba(0, 0, 0, 0.2)",
                                        },
                                    }}
                                >
                                    {React.cloneElement(service.icon, {
                                        sx: {
                                            fontSize: 28,
                                            color: darkMode
                                                ? theme.palette.primary.main
                                                : theme.palette.primary.main,
                                            transition:
                                                "transform 0.2s ease-in-out",
                                            "&:hover": {
                                                transform: "scale(1.2)",
                                            },
                                        },
                                    })}
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {service.text}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {service.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Marquee>
                    </Paper>
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        textAlign="center"
                        my={6}
                    >
                        <Typography
                            variant="h4"
                            component="h2"
                            mb={2}
                            fontWeight="bold"
                        >
                            Contact Us
                        </Typography>
                        <Typography mb={3} color="text.secondary">
                            Have any questions? Reach out to us!
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <IconButton color="primary">
                                <LinkedIn />
                            </IconButton>
                            <IconButton color="secondary">
                                <Email />
                            </IconButton>
                            <IconButton color="success">
                                <Phone />
                            </IconButton>
                        </Stack>
                    </Box>

                    <Box component="footer" textAlign="center" py={2} mt={6}>
                        <Typography color="text.secondary">
                            © {new Date().getFullYear()} Work4U. All rights
                            reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
