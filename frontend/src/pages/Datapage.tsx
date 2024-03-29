import { Card, Container, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContextProvider";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Datapage = () => {
    const {userData} = useContext(AppContext);
    const [exerciseData, setExerciseData] = useState<any>([]);
    const [totals, setTotals] = useState([]);
    const [dateGroup, setDateGroup] = useState("daily");

    const { getAccessTokenSilently } = useAuth0();
    
    useEffect(() => {
        async function fetchData() {
            try {           
                const newExerciseData: any = await axios.get(`/api/users/${userData._id}/stats`);
                setExerciseData(newExerciseData.data);
                setTotals(newExerciseData.data.totals);
            }
            catch (err: any) {
                console.log("There was an error: " + err.error);
            }
        }

        fetchData();        
    }, [userData._id]);

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
                <AreaChart
                    data={exerciseData[dateGroup]}
                    margin={{
                    top: 20,
                    right: 60,
                    left: 10,
                    bottom: 30,
                    }}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area connectNulls type="monotone" dataKey="Push ups" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} />
                    <Area connectNulls type="monotone" dataKey="Pull ups" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
        <Container sx={{display: "flex", flexDirection: "column", justifyContent: "start", mt: 10, width: 300}}>
            {totals.map((exercise:any) => (
            <Card key={exercise.id}
                sx={{p: 2, m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h6">{exercise.id}</Typography>
                <Container sx={{m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography variant="h3" sx={{color: "#4f8fea"}}>{exercise.total}</Typography>
                    <Typography variant="subtitle1">TOTAL</Typography>
                </Container>
                
                <Container sx={{m: 2, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography variant="h3" sx={{color: "#46acb7"}}>{exercise.highscore}</Typography>
                    <Typography variant="subtitle1">HIGHSCORE</Typography>
                </Container>
            </Card>))} 
        </Container>
    </div>);
}

export default Datapage;