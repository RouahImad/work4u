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
    Theme,
    Grid,
} from "@mui/material";
import {
    NightsStayRounded as DarkIcon,
    LightMode as LightIcon,
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
import { Link } from "react-router-dom";
import computerIllustration from "../assets/computer-illustration.png";
import "../App.css";

const services = [
    {
        icon: <Search />,
        text: "Advanced Search",
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
        text: "Secure Protection",
        description:
            "We prioritize your privacy with security measures, ensuring your personal and professional data remains protected.",
    },
    {
        icon: <Globe />,
        text: "Global Opportunities",
        description:
            "Expand your job search beyond borders with international listings from top companies worldwide.",
    },
    {
        icon: <BarChart />,
        text: "Market Insights",
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

export default function Home({
    theme,
    darkMode,
    setDarkMode,
}: {
    theme: Theme;
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
                                <motion.div whileTap={{ scale: 0.9 }}>
                                    <IconButton
                                        onClick={() => setDarkMode(!darkMode)}
                                    >
                                        {darkMode ? (
                                            <LightIcon
                                                sx={{ color: "#ffcc00" }}
                                            />
                                        ) : (
                                            <DarkIcon sx={{ color: "#333" }} />
                                        )}
                                    </IconButton>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component={Link}
                                        to="/login"
                                        sx={{
                                            fontWeight: "600",
                                            fontSize: "15px",
                                            textTransform: "none",
                                            borderRadius: "10px",
                                            color: darkMode ? "#fff" : "#000",
                                            transition: "all 0.3s",
                                            "&:hover": {
                                                backgroundColor: darkMode
                                                    ? "rgba(255,255,255,0.15)"
                                                    : theme.palette.primary
                                                          .light,
                                                color: "#fff",
                                                boxShadow:
                                                    "0 4px 8px rgba(0,0,0,0.1)",
                                            },
                                        }}
                                    >
                                        <span>Sign In</span>
                                    </Button>
                                </motion.div>
                            </Stack>
                        </Box>
                    </Container>
                </AppBar>

                <Container maxWidth="xl" sx={{ p: "0 !important" }}>
                    {/* Hero Section with Split Layout */}
                    <Box
                        sx={{
                            minHeight: "90vh",
                            display: "flex",
                            alignItems: "center",
                            pt: 1,
                            pb: 4,
                            background: darkMode
                                ? "linear-gradient(rgba(18, 18, 18, 0) 0%, rgba(30, 70, 50, 0.3) 80.16%, rgb(18, 18, 18) 100%)"
                                : "linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(214, 254, 241) 80.16%, rgb(255, 255, 255) 100%)",
                        }}
                    >
                        <Grid container spacing={4} alignItems="center" pl={5}>
                            {/* Left side - Text Content */}
                            <Grid
                                className="testtest"
                                item
                                xs={12}
                                md={7}
                                component={motion.div}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: {
                                        xs: "center",
                                        md: "flex-start",
                                    },
                                    textAlign: { xs: "center", md: "left" },
                                    pl: {
                                        xs: "0 !important",
                                        md: "32px !important",
                                    },
                                    pt: "0 !important",
                                    pr: 0,
                                }}
                            >
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    fontWeight="bold"
                                    color="primary"
                                    gutterBottom
                                    sx={{
                                        fontSize: {
                                            xs: "2.1rem",
                                            md: "3.1rem",
                                            lg: "3.7rem",
                                        },
                                        mb: 3,
                                    }}
                                >
                                    Connecting Talent with Opportunity
                                </Typography>
                                <Typography
                                    variant="h6"
                                    paragraph
                                    sx={{
                                        mb: 4,
                                        color: darkMode ? "#fff" : "#333",
                                        maxWidth: "743px",
                                    }}
                                >
                                    Find the perfect job or the right candidate
                                    with our AI-driven job application platform.
                                    Start your journey with Work4U today!
                                </Typography>
                                <Stack
                                    direction="row"
                                    // direction={{ xs: "column", sm: "row" }}
                                    spacing={{ xs: 2, sm: 3 }}
                                    // alignSelf={{
                                    //     xs: "center",
                                    //     md: "flex-start",
                                    // }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            component={Link}
                                            to="/"
                                            variant="contained"
                                            size="medium"
                                            color="primary"
                                            sx={{
                                                color: "#fff",
                                                borderRadius: "10px",
                                                textTransform: "none",
                                                py: {
                                                    xs: 1,
                                                    sm: 1.2,
                                                },
                                                px: {
                                                    xs: 2,
                                                    sm: 3,
                                                },
                                                fontSize: {
                                                    xs: "0.85rem",
                                                    sm: "1rem",
                                                },
                                                fontWeight: 600,
                                                boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            Sign Up as Job Seeker
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            component={Link}
                                            to="/"
                                            variant="contained"
                                            size="medium"
                                            color="secondary"
                                            sx={{
                                                color: "#fff",
                                                borderRadius: "10px",
                                                textTransform: "none",
                                                py: {
                                                    xs: 1,
                                                    sm: 1.2,
                                                },
                                                px: {
                                                    xs: 2,
                                                    sm: 3,
                                                },
                                                fontSize: {
                                                    xs: "0.85rem",
                                                    sm: "1rem",
                                                },
                                                fontWeight: 600,
                                                boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            Sign Up as Employer
                                        </Button>
                                    </motion.div>
                                </Stack>
                            </Grid>

                            {/* Right side - Image */}
                            <Grid
                                item
                                xs={12}
                                md={5}
                                component={motion.div}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    justifyContent: "center",
                                    alignItems: "center",
                                    p: "0 !important",
                                }}
                            >
                                <div className="floating-image-container">
                                    <Box
                                        component="img"
                                        src={computerIllustration}
                                        alt="Job Application Platform"
                                        className="floating-image"
                                        sx={{
                                            maxWidth: {
                                                xs: "90%",
                                                sm: "85%",
                                                md: "90%",
                                            },
                                            height: "auto",
                                            maxHeight: {
                                                xs: "350px",
                                                md: "450px",
                                                lg: "500px",
                                            },
                                            filter: darkMode
                                                ? "brightness(0.85)"
                                                : "none",
                                            transform: {
                                                xs: "scale(0.95)",
                                                md: "scale(1)",
                                            },
                                            transition: "filter 0.3s ease",
                                        }}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Services Section */}
                    <Paper
                        sx={{
                            my: 6,
                            py: 6,
                            px: {
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 4,
                            },
                            borderRadius: 4,
                            textAlign: "center",
                            background: darkMode ? "#1e1e1e" : "#f8f9fa",
                            userSelect: "none",
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
                                        justifyContent: "center",
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
                            <IconButton sx={{ color: "#8099e9" }}>
                                <LinkedIn />
                            </IconButton>
                            <IconButton sx={{ color: "#e99dcb" }}>
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
