import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
