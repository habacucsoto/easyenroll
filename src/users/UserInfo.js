import { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useUser } from './UserContext';

const USER_INFO_QUERY = gql`
  query UserInfoQuery {
    me {
      id
      username
      firstName
      groups {
        name
      }
    }
  }
`;

const UserInfo = () => {
  const { data, loading, error } = useQuery(USER_INFO_QUERY);
  const { setUser } = useUser();

  useEffect(() => {
    if (data) {
      const { id, username, firstName, groups } = data.me;
      setUser({ id, username, firstName, groups });
    }
  }, [data, setUser]);

  if (loading) return null;  // No renderiza nada
  if (error) return null;  // No renderiza nada

  return null;  // No renderiza nada
};

export default UserInfo;
