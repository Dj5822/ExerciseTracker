import { Container, MenuItem, Select, Typography, TextField, Button, Card } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContextProvider";

const RecordExercisePanel = () => {
    const [selectedExercise, setSelectedExercise] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [date, setDate] = useState(new Date());
    const {exerciseTypes} = useContext(AppContext);

    const recordExercise = () => {
        console.log(selectedExercise);
        console.log(quantity);
        console.log(date);
    }

    return (
        <Card sx={{mt: 4, p: 2}}>
            <Container sx={{display: "flex", flexDirection: "column" }}>
                <Typography variant="h5">Record Exercise</Typography>
                <Typography sx={{mt: 2}}>
                    Exercise:
                </Typography>
                <Select defaultValue="" onChange={(event: any) => setSelectedExercise(event.target.value)}>
                    {exerciseTypes.map((exerciseType: any) => <MenuItem key={exerciseType.name} value={exerciseType.name}>{exerciseType.name}</MenuItem>)}
                </Select>
                <Typography sx={{mt: 2}}>
                    Quantity:
                </Typography>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" 
                onChange={(event: any) => setQuantity(event.target.value)} />
                <Typography sx={{mt: 2}}>
                    Date (yyyy-mm-dd):
                </Typography>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" 
                onChange={(event: any) => setDate(event.target.value)} />
                <Button sx={{mt: 2}} onClick={recordExercise} variant="contained">
                    Add
                </Button>
            </Container>
        </Card>
    );
}

export default RecordExercisePanel;