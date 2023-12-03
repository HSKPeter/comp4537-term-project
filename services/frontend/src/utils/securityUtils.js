import { getUserRole, getUserRoleFromCache } from './userRoleUtils';

async function navigateToLoginPageIfRoleNotFound(navigate, location) {
    let role = getUserRoleFromCache();

    if (!role) {
        navigate('/login', { state: { from: location } });
        return false;
    }

    role = await getUserRole();
    if (!role) {
        navigate('/login', { state: { from: location } });
        return false;
    }

    return true;
}

export { navigateToLoginPageIfRoleNotFound };