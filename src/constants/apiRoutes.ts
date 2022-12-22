export const apiRoutes = {
  auth: { login: "/user/login", register: "/user/register" },
  chat: {
    users: {
      getAll: "/users/:id",
      getUserList: "/user/findFriends?keyword=value",
    },
    messages: { getAll: "/message/findAll/:id" },
  },
};
