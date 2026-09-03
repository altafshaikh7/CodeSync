import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const UserAuth = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default UserAuth;