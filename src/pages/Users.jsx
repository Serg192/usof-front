import React, { useEffect, useState } from "react";
import { useGetUsersMutation } from "../features/users/usersApiSlice";
import { Pagination, Grid, Stack, Box } from "@mui/material";
import { PageController, UserProfileIcon } from "../components";
import { Link } from "react-router-dom";

const Users = () => {
  const [getUsers] = useGetUsersMutation();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const loadUsers = async () => {
    try {
      const data = await getUsers(`page=${page}`).unwrap();
      setPagination(data.pagination);
      setUsers(data.records);
      console.log(data.records);
    } catch (err) {}
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Box
      maxWidth={{ lg: "900px", md: "500px", sm: "400px", xs: "50%" }}
      mx="auto"
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {users.map((u) => (
          <Grid mt="30px" item key={u.id} xs={12} sm={6} md={4} lg={3} xl={3}>
            <Link to={`/user/${u.id}`}>
              <UserProfileIcon
                name={u.user_login}
                rating={u.user_rating}
                image={`http://localhost:4545/profile-images/${u.user_profile_picture}`}
                size="128px"
              />
            </Link>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" justifyContent="center" mt="30px">
        <PageController paginationInfo={pagination} setPage={setPage} />
      </Stack>
    </Box>
  );
};

export default Users;
