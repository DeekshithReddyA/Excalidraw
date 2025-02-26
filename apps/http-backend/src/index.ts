import  express  from "express";
import userRouter from './routes/user'



const app = express();

app.use(express.json());
app.use('/' , userRouter);


const PORT = 4000;
app.listen(PORT , () => console.log("HTTP server started at http://localhost:"+PORT))