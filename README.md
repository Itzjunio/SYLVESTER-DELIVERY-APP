# SYLVESTER-DELIVERY-Backend
Delivery Website for online ordering and logistics 
## structure

```
SYLVESTER-DELIVERY-APP/
│
└── backend/
    ├── __test__/
    │
    ├── src/
    │   ├── api/
    │   │   ├── admin/
    │   │   │   ├── controllers.ts
    │   │   │   ├── models.ts
    │   │   │   └── routes.ts
    │   │   ├── customers/
    │   │   │   ├── controllers.ts
    │   │   │   ├── models.ts
    │   │   │   ├── routes.ts
    │   │   │   └── services.ts
    │   │   ├── riders/
    │   │   │   ├── controllers.ts
    │   │   │   ├── models.ts
    │   │   │   ├── routes.ts
    │   │   │   └── services.ts
    │   │   └── vendors/
    │   │       ├── controllers.ts
    │   │       ├── models.ts
    │   │       ├── routes.ts
    │   │       └── services.ts
    │   ├── app.ts
    │   ├── server.ts
    │   ├── shared/
    │   │   ├── auth/
    │   │   │   ├── AuthController.ts
    │   │   │   ├── AuthMiddleware.ts
    │   │   │   ├── AuthRoutes.ts
    │   │   │   └── AuthSchemas.ts
    │   │   ├── config/
    │   │   │   ├── db.ts
    │   │   │   └── firebase.ts
    │   │   ├── map/
    │   │   ├── notifications/
    │   │   │   ├── fcmControllers.ts
    │   │   │   ├── fcmModels.ts
    │   │   │   ├── fcmSchemas.ts
    │   │   │   └── fcmService.ts
    │   │   ├── User/
    │   │   │   ├── UserContollers.ts
    │   │   │   └── UserModel.ts
    │   │   └── utils/
    │   │       ├── audit.ts
    │   │       ├── jwt.ts
    │   │       ├── mailer.ts
    │   │       ├── rate-limiter.ts
    │   │       └── token.ts
    │   └── types/
    │       └── index.d.ts
```

