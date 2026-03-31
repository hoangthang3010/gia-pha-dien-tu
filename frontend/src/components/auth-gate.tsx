import { useAuth } from "./auth-provider";
import { ClanLoader } from "./clan-loader";
import { TreeLoader } from "./tree-loader";

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    if (loading) return null;

    return (
        <>
            <TreeLoader />
            <ClanLoader />
            {children}
        </>
    );
}