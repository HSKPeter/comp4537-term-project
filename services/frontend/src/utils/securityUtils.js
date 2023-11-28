import { getUserRole, getUserRoleFromCache } from './userRoleUtils';

async function navigateToLoginPageIfRoleNotFound(navigate, location) {
    let role = getUserRoleFromCache();

    if (!role) {
        navigate('/login', { state: { from: location } });
        return;
    }

    role = await getUserRole();
    if (!role) {
        navigate('/login', { state: { from: location } });
        return;
    }
}

export { navigateToLoginPageIfRoleNotFound };