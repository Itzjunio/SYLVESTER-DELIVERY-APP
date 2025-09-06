import app from './app.js'
import { connectDB } from './shared/config/db.js';


const PORT = process.env.PORT || 3000;

const startServer = async()=>{

  try{
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

  }catch(error){
    console.error('Failed to start server:', error);
    process.exit(1);

  }
}

startServer();


