import { Typography, Card, Container } from "@mui/material";

const HighscorePanel = () => {
    return  <Card sx={{ mt: 8, p: 2, ml: 2, mr: 2, width: "fit-content"}}>
        <Typography variant="h5">High score</Typography>
        <Container sx={{display: "flex", flexDirection: "row"}}>
            <Card sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h5">Set</Typography>
                <Typography variant="h3">100</Typography>
                <Typography variant="subtitle1">Push ups</Typography>
                <Typography variant="h3">100</Typography>
                <Typography variant="subtitle1">Pull ups</Typography>
            </Card>
            <Card sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h5">Daily</Typography>
                <Typography variant="h3">100</Typography>
                <Typography variant="subtitle1">Push ups</Typography>
                <Typography variant="h3">100</Typography>
                <Typography variant="subtitle1">Pull ups</Typography>
            </Card>
            <Card sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h5">Monthly</Typography>
                <Typography variant="h3">100</Typography>
                <Typography variant="subtitle1">Push ups</Typography>
                <Typography variant="h3">100</Typography>
                <Typography variant="subtitle1">Pull ups</Typography>
            </Card>
        </Container>
    </Card>
}

export default HighscorePanel;