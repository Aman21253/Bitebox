import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const response =
        await API.get(
          "/admin/orders"
        );

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
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
              Platform Orders
            </h1>

          </div>

          {
            loading ? (

              <div className="
                text-3xl
                font-black
              ">
                Loading Orders...
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
                        Order ID
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Customer
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Amount
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Payment
                      </th>

                      <th className="
                        px-8
                        py-6
                        text-left
                      ">
                        Delivery
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {
                      orders.map((order) => (

                        <tr
                          key={order.id}
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
                            #{order.id}
                          </td>

                          <td className="
                            px-8
                            py-6
                          ">
                            {
                              order.customer?.name
                            }
                          </td>

                          <td className="
                            px-8
                            py-6
                            text-orange-400
                            font-bold
                          ">
                            ₹{
                              order.total_amount
                            }
                          </td>

                          <td className="
                            px-8
                            py-6
                          ">
                            {
                              order.payment_status
                            }
                          </td>

                          <td className="
                            px-8
                            py-6
                          ">
                            {
                              order.delivery_status
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

export default AdminOrders;