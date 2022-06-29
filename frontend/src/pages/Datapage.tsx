import { Button, ButtonGroup, Card, Container, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContextProvider";
import axios from "axios";

const Datapage = () => {
    const {userData} = useContext(AppContext);
    const [exerciseData, setExerciseData] = useState([]);
    const [totals, setTotals] = useState([]);
    const [dateGroup, setDateGroup] = useState("daily");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const newExerciseData: any = await axios.get(`/api/users/${userData._id}/stats`);
            let exerciseArray;
            if (dateGroup === "daily") {
                exerciseArray = newExerciseData.data.daily;
            }
            else if (dateGroup === "monthly") {
                exerciseArray = newExerciseData.data.monthly;
            }
            else if (dateGroup === "yearly") {
                exerciseArray = newExerciseData.data.yearly;
            }

            const data: any = exerciseArray.map((item: any) => {
                let output: any = {
                    date: item._id
                }
        
                for (const exercise of item.exercises) {
                    output[exercise.name] = exercise.total;
                }
        
                return output;
            });
            setExerciseData(data);
            setTotals(newExerciseData.data.totals);
            setIsLoading(false);
        }

        fetchData();        
    }, [userData._id, dateGroup]);

    const handleSetDateGroup = (event: any, newDateGroup: any) => {
        setDateGroup(newDateGroup);
    }

    return (<div style={{ display: 'flex', flexDirection: "row", width: "100%"}}>
        <Card sx={{width: "85%", height: "85vh", ml: 4, mt: 12}}>
            <div style={{marginRight: 60, marginTop: 10, display: "flex", flexDirection:"row", justifyContent:"end"}}>
                <ToggleButtonGroup exclusive onChange={handleSetDateGroup} value={dateGroup}
                aria-label="outlined primary button group" >
                    <ToggleButton value="daily">Daily</ToggleButton>
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="yearly">Yearly</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={exerciseData}
                    margin={{
                    top: 20,
                    right: 60,
                    left: 10,
                    bottom: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line connectNulls type="monotone" dataKey="Push ups" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line connectNulls type="monotone" dataKey="Pull ups" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
        <Container sx={{display: "flex", flexDirection: "column", justifyContent: "space-evenly", mt: 12, width: 300}}>
            {totals.map((exercise:any) => (
            <Card sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h4">{exercise.id}</Typography>
                <Container sx={{m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography variant="h3" sx={{color: "green"}}>{exercise.total}</Typography>
                    <Typography variant="subtitle1" sx={{color: "green"}}>Total</Typography>
                </Container>
                
                <Container sx={{m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography variant="h3" sx={{color: "blue"}}>{exercise.highscore}</Typography>
                    <Typography variant="subtitle1" sx={{color: "blue"}}>Highscore</Typography>
                </Container>
            </Card>))} 
        </Container>
    </div>);
}

export default Datapage;