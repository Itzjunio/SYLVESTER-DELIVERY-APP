
import express, { Application } from 'express';
import authRouter from './shared/auth/AuthRoutes.js';

declare global {
    namespace Express {
        interface User {
            _id: string;
            role: string;
        }
        interface Request {
            user?: User;
        }
    }
}

// import { customerRoutes } from './api/customers/routes';
// import { vendorRoutes } from './api/vendors/routes';
// import { riderRoutes } from './api/riders/routes';
// import { adminRoutes } from './api/admin/routes';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use("/auth", authRouter)
// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Welcome to the Food Delivery App API!' });
// });


// app.use('/api/customers', customerRoutes);
// app.use('/api/vendors', vendorRoutes);
// app.use('/api/riders', riderRoutes);
// app.use('/api/admin', adminRoutes);

export default app;
