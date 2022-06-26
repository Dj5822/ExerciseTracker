import { Container } from "@mui/material";
import AveragescorePanel from "../components/AveragescorePanel";
import HighscorePanel from "../components/HighscorePanel";

const Datapage = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 16, mb: 4, display: "flex", flexDirection: "row" }}>
            <HighscorePanel />
            <AveragescorePanel />
        </Container>
    );
}

export default Datapage;