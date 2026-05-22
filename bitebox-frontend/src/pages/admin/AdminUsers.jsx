import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminUsers() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    try {

      const response =
        await API.get(
          "/admin/users"
        );

      setUsers(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const suspendUser =
    async (userId) => {

      try {

        await API.put(
          `/admin/users/${userId}/suspend`
        );

        fetchUsers();

      } catch (error) {

        console.log(error);
      }
    };

  const activateUser =
    async (userId) => {

      try {

        await API.put(
          `/admin/users/${userId}/activate`
        );

        fetchUsers();

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      <AdminSidebar />

      <div className="
        flex-1
        p-10
      ">

        <div className="
          max-w-[1700px]
          mx-auto
        ">

          <div className="
            mb-10
          ">

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-4
            ">
              Admin Panel
            </p>

            <h1 className="
              text-5xl
              font-black
            ">
              Users Management
            </h1>

          </div>

          {
            loading ? (

              <div className="
                text-3xl
                font-black
              ">
                Loading Users...
              </div>

            ) : (

              <div className="
                overflow-x-auto
                rounded-[32px]
                border
                border-white/10
                bg-white/[0.03]
              ">

                <table className="
                  w-full
                ">

                  <thead>

                    <tr className="
                      border-b
                      border-white/10
                    ">

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Name
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Email
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Role
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Status
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {
                      users.map((user) => (

                        <tr
                          key={user.id}
                          className="
                            border-b
                            border-white/5
                          "
                        >

                          <td className="
                            px-8
                            py-6
                            font-bold
                          ">
                            {user.name}
                          </td>

                          <td className="
                            px-8
                            py-6
                          ">
                            {user.email}
                          </td>

                          <td className="
                            px-8
                            py-6
                            capitalize
                          ">
                            {
                              user.role?.value ||
                              user.role
                            }
                          </td>

                          <td className="
                            px-8
                            py-6
                          ">

                            <span className={`
                              px-4
                              py-2
                              rounded-xl
                              text-sm
                              font-bold

                              ${
                                user.status ===
                                "active"

                                ? `
                                  bg-green-500/10
                                  text-green-300
                                  border
                                  border-green-500/20
                                `

                                : `
                                  bg-red-500/10
                                  text-red-300
                                  border
                                  border-red-500/20
                                `
                              }
                            `}>

                              {user.status}

                            </span>

                          </td>

                          <td className="
                            px-8
                            py-6
                          ">

                            {
                              user.status ===
                              "active"

                              ? (

                                <button
                                  onClick={() =>
                                    suspendUser(
                                      user.id
                                    )
                                  }
                                  className="
                                    px-5
                                    py-3
                                    rounded-2xl
                                    bg-red-500
                                    font-bold
                                  "
                                >
                                  Suspend
                                </button>

                              ) : (

                                <button
                                  onClick={() =>
                                    activateUser(
                                      user.id
                                    )
                                  }
                                  className="
                                    px-5
                                    py-3
                                    rounded-2xl
                                    bg-green-500
                                    font-bold
                                  "
                                >
                                  Activate
                                </button>

                              )
                            }

                          </td>

                        </tr>
                      ))
                    }

                  </tbody>

                </table>

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;