# SYLVESTER-DELIVERY-Backend
Delivery Website for online ordering and logistics 
## structure

```
backend/
└── src/
    ├── shared/
    │   ├── auth/
    │   ├── database/
    │       └── db.ts
    │   ├── map/
    │   └── notifications/
    │       └── fcm.ts
    ├── api/
    │   ├── customers/
    │   │   ├── routes.ts
    │   │   ├── controllers.ts
    │   │   ├── services.ts
    │   │   └── models.ts
    │   ├── dilivers/
    │   │   ├── routes.ts
    │   │   ├── controllers.ts
    │   │   ├── services.ts
    │   │   └── models.ts
    │   ├── vendors/
    │   │    ├── routes.ts
    │   │    ├── controllers.ts
    │   │    ├── services.ts
    │   │    └── models.ts
    │   └── admin/
    │        ├── routes.ts
    │        ├── controllers.ts
    │        └── models.ts
    └──types/
        └──index.d.ts  
```

