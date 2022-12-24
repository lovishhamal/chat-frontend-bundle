export const apiRoutes = {
  auth: { login: "/user/login", register: "/user/register" },
  chat: {
    users: {
      getAll: "/users/:id",
      getUserFriends: "/user/findFriends/:id?keyword=value",
    },
    messages: { getAll: "/message/findAll" },
  },
  user: {
    connection: "/user/connection",
  },
};
