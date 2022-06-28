import { Card, Container } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AveragescorePanel from "../components/AveragescorePanel";
import HighscorePanel from "../components/HighscorePanel";
import { useContext } from "react";
import { AppContext } from "../context/AppContextProvider";

const Datapage = () => {
    const { exerciseData } = useContext(AppContext);

    const data = exerciseData.log;

    return (
        <ResponsiveContainer width="95%" height="95%">
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                top: 100,
                right: 0,
                left: 20,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quantity" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Datapage;