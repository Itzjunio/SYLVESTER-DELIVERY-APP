import {server} from './app'
import { connectDB } from './shared/config/db';


const PORT = process.env.PORT || 3000;

const startServer = async()=>{

  try{
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

  }catch(error){
    console.error('Failed to start server:', error);
    process.exit(1);

  }
}

startServer();


