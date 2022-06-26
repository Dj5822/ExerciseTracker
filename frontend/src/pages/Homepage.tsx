import { useContext } from 'react';
import { CircularProgress } from '@mui/material';
import Container from '@mui/material/Container';
import {AppContext} from "../context/AppContextProvider"
import ExerciseLog from '../components/ExerciseLog';
import RecordExercisePanel from '../components/RecordExercisePanel';

const Homepage = () => {
    const { isLoading } = useContext(AppContext);

    return (
        <Container maxWidth="lg" sx={{ mt: 16, mb: 4 }}>
            {isLoading ? <CircularProgress /> : 
            <div>
                <RecordExercisePanel />
                <ExerciseLog />
            </div>}
        </Container>
    );
}

export default Homepage;