'use client';

import { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { User, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
    // In a real application, you would fetch user data from an API
    const [user, setUser] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '123-456-7890',
        role: 'Administrator',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editableName, setEditableName] = useState(user.name);
    const [editableEmail, setEditableEmail] = useState(user.email);
    const [editablePhone, setEditablePhone] = useState(user.phone);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setUser({ ...user, name: editableName, email: editableEmail, phone: editablePhone });
        setIsEditing(false);
        // In a real application, you would send updated data to an API
        alert('Profile updated successfully!');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditableName(user.name);
        setEditableEmail(user.email);
        setEditablePhone(user.phone);
    };

    return (
        <PageWrapper>
            <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        <User size={32} className="text-gray-600" />
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editableName}
                                onChange={(e) => setEditableName(e.target.value)}
                                className="text-xl font-bold border-b-2 border-gray-300 focus:outline-none"
                            />
                        ) : (
                            <h2 className="text-xl font-bold">{user.name}</h2>
                        )}
                        <p className="text-gray-600">{user.role}</p>
                    </div>
                </div>
                <div className="mb-2 flex items-center">
                    <Mail size={20} className="text-gray-500 mr-2" />
                    {isEditing ? (
                        <input
                            type="email"
                            value={editableEmail}
                            onChange={(e) => setEditableEmail(e.target.value)}
                            className="text-gray-700 border-b-2 border-gray-300 focus:outline-none"
                        />
                    ) : (
                        <p className="text-gray-700">{user.email}</p>
                    )}
                </div>
                <div className="mb-4 flex items-center">
                    <Phone size={20} className="text-gray-500 mr-2" />
                    {isEditing ? (
                        <input
                            type="tel"
                            value={editablePhone}
                            onChange={(e) => setEditablePhone(e.target.value)}
                            className="text-gray-700 border-b-2 border-gray-300 focus:outline-none"
                        />
                    ) : (
                        <p className="text-gray-700">{user.phone}</p>
                    )}
                </div>
                {isEditing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </PageWrapper>
    );
}

// import { useState } from 'react';
// import PageWrapper from '@/components/PageWrapper';
// import { User, Mail, Phone } from 'lucide-react';

// export default function ProfilePage() {
//     // In a real application, you would fetch user data from an API
//     const [user, setUser] = useState({
//         name: 'Admin User',
//         email: 'admin@example.com',
//         phone: '123-456-7890',
//         role: 'Administrator',
//     });

//     const [isEditing, setIsEditing] = useState(false);
//     const [editableName, setEditableName] = useState(user.name);
//     const [editableEmail, setEditableEmail] = useState(user.email);
//     const [editablePhone, setEditablePhone] = useState(user.phone);

//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     const handleSave = () => {
//         setUser({ ...user, name: editableName, email: editableEmail, phone: editablePhone });
//         setIsEditing(false);
//         // In a real application, you would send updated data to an API
//         alert('Profile updated successfully!');
//     };

//     const handleCancel = () => {
//         setIsEditing(false);
//         setEditableName(user.name);
//         setEditableEmail(user.email);
//         setEditablePhone(user.phone);
//     };

//     return (
//         <PageWrapper>
//             <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
//             <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
//                 <div className="flex items-center mb-4">
//                     <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
//                         <User size={32} className="text-gray-600" />
//                     </div>
//                     <div>
//                         {isEditing ? (
//                             <input
//                                 type="text"
//                                 value={editableName}
//                                 onChange={(e) => setEditableName(e.target.value)}
//                                 className="text-xl font-bold border-b-2 border-gray-300 focus:outline-none"
//                             />
//                         ) : (
//                             <h2 className="text-xl font-bold">{user.name}</h2>
//                         )}
//                         <p className="text-gray-600">{user.role}</p>
//                     </div>
//                 </div>
//                 <div className="mb-2 flex items-center">
//                     <Mail size={20} className="text-gray-500 mr-2" />
//                     {isEditing ? (
//                         <input
//                             type="email"
//                             value={editableEmail}
//                             onChange={(e) => setEditableEmail(e.target.value)}
//                             className="text-gray-700 border-b-2 border-gray-300 focus:outline-none"
//                         />
//                     ) : (
//                         <p className="text-gray-700">{user.email}</p>
//                     )}
//                 </div>
//                 <div className="mb-4 flex items-center">
//                     <Phone size={20} className="text-gray-500 mr-2" />
//                     {isEditing ? (
//                         <input
//                             type="tel"
//                             value={editablePhone}
//                             onChange={(e) => setEditablePhone(e.target.value)}
//                             className="text-gray-700 border-b-2 border-gray-300 focus:outline-none"
//                         />
//                     ) : (
//                         <p className="text-gray-700">{user.phone}</p>
//                     )}
//                 </div>
//                 {isEditing ? (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={handleSave}
//                             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         >
//                             Save
//                         </button>
//                         <button
//                             onClick={handleCancel}
//                             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 ) : (
//                     <button
//                         onClick={handleEdit}
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                         Edit Profile
//                     </button>
//                 )}
//             </div>
//         </PageWrapper>
//     );
// }